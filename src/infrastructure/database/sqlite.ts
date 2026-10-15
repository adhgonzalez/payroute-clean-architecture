/**
 * @fileoverview Inicialización y gestión de la conexión y esquema relacional con bun:sqlite.
 * @author Adrián David Hernández González <https://github.com/adhgonzalez>
 * @project PayRoute
 * @license MIT
 */
import { Database } from "bun:sqlite";

// Abre la base de datos o crea el archivo payroute.sqlite si no existe
export const db = new Database("payroute.sqlite", { create: true });

// Inicializar tablas necesarias para la pasarela
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      country TEXT NOT NULL,
      gateway TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payment_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_id TEXT,
      gateway TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
