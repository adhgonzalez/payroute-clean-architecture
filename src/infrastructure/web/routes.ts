/**
 * @fileoverview Definición de rutas y endpoints de la API REST construidos con Hono.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { Hono } from "hono";
import { type PaymentRequest } from "../../core/interfaces/payments-interfaces";
import { paymentController } from "./controllers/payment.controller";
import { db } from "../database/sqlite";

export const app = new Hono();

// Preparar la inserción
const insertPayment = db.prepare(`
  INSERT INTO payments (id, amount, currency, country, gateway, status)
  VALUES (?, ?, ?, ?, ?, ?)
`);

app.post('/api/v1/payments/charge', async (c) => {
  try {
    const body: PaymentRequest = await c.req.json();

    if (!body.amount || !body.country) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Faltan datos obligatorios (amount | country)'
        }
      }, 400);
    }

    const result = await paymentController(body);

    // Ejecutar cuando la cadena devuelva éxito
    insertPayment.run(
      result.transactionId,
      body.amount,
      body.currency,
      body.country,
      result.gatewayUsed,
      "COMPLETED"
    );

    return c.json(result, 201);
  } catch (err) {
    const errorknown = err instanceof Error ? err.message : String(err);
    return c.json({
      success: false,
      error: {
        code: 'PAYMENT_FAILED',
        message: errorknown
      }
    }, 500);
  }
});


