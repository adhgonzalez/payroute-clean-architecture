# PayRoute - Clean Architecture Payment Processing Engine

[![CI](https://github.com/adhgonzalez/payroute-clean-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/adhgonzalez/payroute-clean-architecture/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/adhgonzalez/payroute-clean-architecture/badge.svg?branch=main)](https://coveralls.io/github/adhgonzalez/payroute-clean-architecture?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bun Version](https://img.shields.io/badge/Bun->=1.0.0-black?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

Motor de procesamiento y enrutamiento inteligente de pagos disenado bajo los principios de Clean Architecture. Su objetivo principal es ofrecer tolerancia a fallos mediante una estrategia de fallback automatico entre diferentes proveedores de pago (Stripe, PayPal, Mercado Pago) en funcion de la geolocalizacion del cliente.

---

## Caracteristicas Principales

- Diseno desacoplado mediante Clean Architecture y separacion estricta de capas.
- Patron Chain of Responsibility para ejecucion de pasarelas y resolucion de fallos en cascada.
- Enrutamiento dinamico segun el pais de origen de la transaccion.
- Persistencia local y eficiente utilizando SQLite embebido mediante bun:sqlite.
- Pipeline de integracion continua con GitHub Actions y medicion de cobertura con Coveralls.
- Conjunto de pruebas de integracion HTTP y persistencia con Supertest y bun:test.

---

## Stack Tecnologico

- Runtime: Bun
- Web Framework: Hono
- Lenguaje: TypeScript
- Base de Datos: SQLite (bun:sqlite)
- Testing: bun:test y Supertest
- CI / Cobertura: GitHub Actions y Coveralls

---

## Estructura del Proyecto

El codigo fuente esta organizado siguiendo los principios de arquitectura limpia:

```text
src/
├── core/
│   ├── interfaces/
│   │   ├── payments-interfaces.ts   # Contratos y tipos del dominio de pagos
│   │   └── request-interfaces.ts    # Tipado y validacion de peticiones
│   └── smart-router.ts              # Motor Chain of Responsibility y reglas de negocio
├── infrastructure/
│   ├── database/
│   │   └── sqlite.ts                # Inicializacion de esquemas y conexion SQLite
│   ├── gateways/                    # Adaptadores hacia proveedores externos
│   │   ├── mercado-pago-adapter.ts
│   │   ├── paypal-adapter.ts
│   │   └── stripe-adapter.ts
│   ├── web/
│   │   ├── controllers/
│   │   │   └── payment.controller.ts # Controlador de la capa web
│   │   └── routes.ts                # Definicion de endpoints HTTP con Hono
│   └── server.ts                    # Punto de entrada de la aplicacion
test/
└── payment-api.test.ts              # Pruebas de integracion HTTP y persistencia
