/**
 * @fileoverview Adaptador de integración para procesar pagos y cargos con tarjeta a través de Stripe.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type PaymentGateway, type PaymentRequest, type PaymentResponse } from "../../core/interfaces/payments-interfaces.js";

export class StripeAdapter implements PaymentGateway {
  name = "Stripe";

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simular latencia de red de Stripe con Bun
    await Bun.sleep(200); 

    // Simulamos un fallo aleatorio del 15% para probar nuestro sistema de redundancia
    if (Math.random() < 0.15) {
      throw new Error("Stripe API Error: Connection timeout (500)");
    }

    return {
      success: true,
      transactionId: `ch_stripe_${crypto.randomUUID().slice(0, 8)}`,
      gatewayUsed: this.name
    };
  }
}
