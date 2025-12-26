# Peluquería – Backend API

Backend de una aplicación web para la gestión integral de una peluquería.  
El sistema permite administrar turnos, clientes, servicios, stock de materiales y pagos online mediante Mercado Pago.

Este proyecto fue desarrollado como trabajo grupal.  
Mi principal aporte estuvo enfocado en el **diseño de la base de datos**, la **arquitectura backend**, la **implementación de autenticación** y la **lógica de negocio principal**.

---

## Funcionalidades principales

- Gestión de turnos (appointments)
- Administración de clientes y servicios
- Control de stock de materiales
- Autenticación y autorización con JWT y roles
- Integración de pagos mediante la API de Mercado Pago
- Manejo de horarios y disponibilidad
- API REST estructurada por módulos

---

## Arquitectura

El backend está desarrollado siguiendo una **arquitectura modular** con NestJS, separando responsabilidades por dominio:

- `auth`: autenticación, autorización y roles
- `client`: gestión de clientes
- `service`: servicios ofrecidos por la peluquería
- `schedule`: manejo de horarios y disponibilidad
- `appointment`: turnos y flujo principal del negocio
- `payments`: integración con Mercado Pago
- `database`: configuración ORM y conexión a la base de datos
- `shared`: utilidades, DTOs y lógica reutilizable

---

## Base de datos

- Motor: **MySQL (Percona Server)**
- ORM: **MikroORM**

El esquema de base de datos fue **diseñado desde cero**, priorizando:
- Normalización
- Relaciones claras entre entidades
- Escalabilidad
- Separación entre lógica de dominio y persistencia

---

## Autenticación y seguridad

- Autenticación basada en **JWT**
- Guards personalizados
- Manejo de roles y permisos
- DTOs para validación de datos de entrada

---

## Pagos

El sistema se integra con la **API de Mercado Pago** para gestionar pagos asociados a turnos, permitiendo:
- Generación de pagos
- Asociación con turnos
- Control del estado de las transacciones

---

## Tecnologías utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **MikroORM**
- **MySQL (Percona Server)**
- **JWT**
- **Mercado Pago API**
- **Docker (nociones básicas)**

---

## Configuración del entorno

Crear un archivo `.env` a partir de `.env.example` y configurar las variables necesarias:

```bash
cp .env.example .env
```

---

## Instalación 

```bash
pnpm install
```
---

## Levantar la aplicación

```bash
pnpm start:dev
```