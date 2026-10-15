/**
 * @fileoverview Adaptador de integración para procesar pagos a través de la API de Mercado Pago.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type PaymentGateway, type PaymentRequest, type PaymentResponse } from "../../core/interfaces/payments-interfaces.js";

export class MercadoPagoAdapter implements PaymentGateway {
  name = "Mercado Pago";

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simular latencia de red de Mercado Pago con Bun
    await Bun.sleep(350); 

    // Simulamos un fallo aleatorio del 20% para probar nuestro sistema de redundancia
    if (Math.random() < 0.2) {
      throw new Error("Mercado Pago API Error: Connection timeout (500)");
    }

    return {
      success: true,
      transactionId: `MP_${crypto.randomUUID().slice(0, 8)}`,
      gatewayUsed: this.name
    };
  }
}
