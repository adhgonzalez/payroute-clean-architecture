/**
 * @fileoverview Controlador que orquesta la lógica de negocio y coordina el enrutador de pagos con la respuesta HTTP.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type PaymentRequest, type PaymentResponse } from "../../../core/interfaces/payments-interfaces";
import { GatewayHandler } from "../../../core/smart-router";
import { MercadoPagoAdapter } from "../../gateways/mercado-pago-adapter";
import { StripeAdapter } from "../../gateways/stripe-adapter";
import { PayPalAdapter } from "../../gateways/paypal-adapter";

const ROUTING_RULES: Record<string, string[]> = {
  // En Argentina: Mercado Pago primero, Stripe de respaldo, PayPal último
  AR: ["mercado pago", "stripe", "paypal"],
  // En España: Stripe primero, PayPal de respaldo
  ES: ["stripe", "paypal"],
  // En Estados Unidos: Stripe primero, PayPal de respaldo
  US: ["stripe", "paypal"],
  // Resto del mundo:
  DEFAULT: ["stripe", "paypal"]
};


// Función auxiliar para instanciar el handler correspondiente al nombre
function createHandler(providerName: string): GatewayHandler {
  switch (providerName) {
    case "stripe":
      return new GatewayHandler(new StripeAdapter());
    case "paypal":
      return new GatewayHandler(new PayPalAdapter());
    case "mercado pago":
      return new GatewayHandler(new MercadoPagoAdapter());
    default:
      throw new Error(`Proveedor no soportado: ${providerName}`);
  }
}

export async function paymentController(req: PaymentRequest): Promise<PaymentResponse> {
  const sequence = ROUTING_RULES[req.country] ?? ROUTING_RULES["DEFAULT"] ?? ["stripe", "paypal"];

  const handlers = sequence.map((name) => createHandler(name));

  // Encadenar cada handler con el siguiente (handler[i].setNext(handler[i + 1]))
  for (let i = 0; i < handlers.length - 1; i++) {
    handlers[i].setNext(handlers[i + 1]);
  }

  // El punto de entrada siempre es el primer elemento de la cadena
  const headHandler = handlers[0];
  
  return await headHandler.handle(req);
}