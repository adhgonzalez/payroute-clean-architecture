/**
 * @fileoverview Punto de entrada y configuración del servidor HTTP con Hono y el entorno de ejecución Bun.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { app } from "./infrastructure/web/routes";

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};