/**
 * @fileoverview Adaptador de integración para procesar pagos a través de la API de PayPal.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type PaymentGateway, type PaymentRequest, type PaymentResponse } from "../../core/interfaces/payments-interfaces.js";

export class PayPalAdapter implements PaymentGateway {
  name = "PayPal";

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    await Bun.sleep(400); // PayPal suele ser un poco más lento

    // Simulamos que PayPal es más estable (solo 5% de fallo)
    if (Math.random() < 0.05) {
      throw new Error("PayPal API Error: Internal Server Error (502)");
    }

    return {
      success: true,
      transactionId: `PAYID-PAYPAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      gatewayUsed: this.name
    };
  }
}
