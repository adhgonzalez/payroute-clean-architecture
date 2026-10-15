/**
 * @fileoverview Suite de pruebas de integración HTTP y validación de persistencia en SQLite para la API de pagos.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createServer } from "node:http";
import { getRequestListener } from "@hono/node-server";
import { db } from "../src/infrastructure/database/sqlite.js";
import { app } from "../src/infrastructure/web/routes.js";
import * as controllerModule from "../src/infrastructure/web/controllers/payment.controller.js";

// Creamos un servidor HTTP en memoria para que Supertest lo consuma
const server = createServer(getRequestListener(app.fetch));

describe("POST /api/v1/payments/charge (Supertest)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("debe retornar 400 Bad Request si faltan amount o country", async () => {
    const invalidPayload = {
      currency: "USD",
      // amount y country no están presentes
    };

    const response = await request(server)
      .post("/api/v1/payments/charge")
      .send(invalidPayload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Faltan datos obligatorios (amount | country)",
      },
    });
  });

it("debe retornar 201 Created y guardar en BD cuando el pago es exitoso", async () => {
    const dynamicId = `tx_success_${Date.now()}`;
    const validPayload = {
      amount: 2500,
      currency: "USD",
      country: "US",
      customer: { id: "cust_1" },
    };

    // Mockeamos la respuesta del controlador
    vi.spyOn(controllerModule, "paymentController").mockResolvedValue({
      success: true,
      transactionId: dynamicId,
      gatewayUsed: "stripe",
    });

    const response = await request(server)
      .post("/api/v1/payments/charge")
      .send(validPayload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      transactionId: dynamicId,
      gatewayUsed: "stripe",
    });
  });

  it("debe invocar a paymentController con el país Argentina ('AR') para priorizar pasarela local", async () => {
    const dynamicId = `tx_ar_${Date.now()}`;
    const payload = {
      amount: 15000,
      currency: "ARS",
      country: "AR",
      customer: { id: "cust_ar_9" },
    };

    const spy = vi.spyOn(controllerModule, "paymentController").mockResolvedValue({
      success: true,
      transactionId: dynamicId,
      gatewayUsed: "mercado pago",
    });

    const response = await request(server)
      .post("/api/v1/payments/charge")
      .send(payload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.gatewayUsed).toBe("mercado pago");

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "AR",
        amount: 15000,
      })
    );
  });

  it("debe retornar 500 Internal Server Error si la cadena de pagos falla", async () => {
    const validPayload = {
      amount: 1000,
      currency: "USD",
      country: "AR",
    };

    // Simulamos que el controlador lanza un error
    vi.spyOn(controllerModule, "paymentController").mockRejectedValue(
      new Error("Todas las pasarelas de pago de la cadena fallaron.")
    );

    const response = await request(server)
      .post("/api/v1/payments/charge")
      .send(validPayload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "PAYMENT_FAILED",
        message: "Todas las pasarelas de pago de la cadena fallaron.",
      },
    });
  });
  it("debe insertar el registro real en la base de datos SQLite tras un pago exitoso", async () => {
    const transactionId = `tx_sqlite_${Date.now()}`;
    const payload = {
      amount: 450.50,
      currency: "EUR",
      country: "ES",
      customer: { id: "cust_es_1" }
    };

    // Simulamos éxito en el controlador con un ID específico
    vi.spyOn(controllerModule, "paymentController").mockResolvedValue({
      success: true,
      transactionId: transactionId,
      gatewayUsed: "stripe",
    });

    const response = await request(server)
      .post("/api/v1/payments/charge")
      .send(payload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);

    // Consultamos directamente en SQLite para validar la persistencia real
    const row = db.prepare("SELECT * FROM payments WHERE id = ?").get(transactionId) as any;

    expect(row).toBeDefined();
    expect(row.id).toBe(transactionId);
    expect(row.amount).toBe(450.50);
    expect(row.currency).toBe("EUR");
    expect(row.country).toBe("ES");
    expect(row.gateway).toBe("stripe");
    expect(row.status).toBe("COMPLETED");
  });

  it("debe responder con error cuando el cliente envía un body completamente vacío", async () => {
    const response = await request(server)
      .post("/api/v1/payments/charge")
      .set("Content-Type", "application/json"); // Sin .send()

    // Al fallar c.req.json() entrará en el catch o responderá código de error
    expect([400, 500]).toContain(response.status);
    expect(response.body.success).toBe(false);
  });

});