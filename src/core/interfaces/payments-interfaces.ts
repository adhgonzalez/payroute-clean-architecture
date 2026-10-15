/**
 * @fileoverview Definición de contratos, tipos y respuestas para las pasarelas de pago y transacciones.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type CustomerInfo, type PaymentMethod } from "./request-interfaces";

export interface PaymentRequest {
  amount: number;
  currency: string;
  country: string;
  description?: string;
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  gatewayUsed: string;
  errorMessage?: string;
}

export interface PaymentGateway {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}
