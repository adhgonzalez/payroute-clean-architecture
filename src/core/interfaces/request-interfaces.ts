/**
 * @fileoverview Tipos e interfaces para la validación y estructura del cuerpo de las peticiones entrantes.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
export interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
}

export interface CardDetails {
  holderName: string;
  number: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

export interface PaymentMethod {
  type: "card" | "token";
  card?: CardDetails;
  token?: string;
}



