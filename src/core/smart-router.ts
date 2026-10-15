/**
 * @fileoverview Motor de enrutamiento inteligente (Chain of Responsibility) para selección y fallback de pasarelas según geolocalización.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { type PaymentResponse, type PaymentRequest, type PaymentGateway } from "./interfaces/payments-interfaces";

export abstract class PaymentHandler {
  protected nextHandler: PaymentHandler | null = null;

  public setNext(handler: PaymentHandler): PaymentHandler {
    this.nextHandler = handler;
    return handler;
  }

  public abstract handle(request: PaymentRequest): Promise<PaymentResponse>;
}

export class GatewayHandler extends PaymentHandler {
  public constructor(private readonly gateway: PaymentGateway) {
    super();
  }

  public async handle(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      return this.gateway.processPayment(request);
    } catch(err) {
      if (this.nextHandler) {
        return await this.nextHandler.handle(request);
      } else {
        throw new Error(`Todas las pasarelas de pago de la cadena fallaron. Último error: ${err}`)
      }
    }
  }
}