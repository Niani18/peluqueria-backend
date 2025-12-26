# TODO - Backend Proyecto NestJS + MikroORM

## Base del proyecto

- [ ] Actualizar `.env.example` con todas las variables necesarias.

## Modelo de datos (MikroORM)

- [ ] Revisar relaciones (dueño/inverso) y `cascade` donde haga falta. (solo revisar)
- [ ] Herencia `Material` (Tools/Supplies): dejar `type` en constructor. (creo que hecho, revisar)
- [ ] Cambiar `updateSchema()` por migrations (`mikro-orm migration:create`). (no se lo que es, revisar)

## DTOs + Validación

- [ ] DTOs en todas las rutas (POST/PATCH). (creo que hecho, revisar)
- [ ] Usar `@ValidateNested()` + `@Type(() => SubDto)` para objetos anidados. (creo que hecho, revisar, pero agregaria revisar el parse in de los parametros)
- [ ] IDs validados con `@IsInt()` y resueltos en service con `findOneOrFail`/`ref`. (No hecho creo)
- [ ] Activar ValidationPipe global con `whitelist`, `transform` y `enableImplicitConversion`. (hecho)

## Controladores (HTTP)

- [ ] Ordenar rutas: estáticas primero, luego paramétricas. (falta hacer)
- [ ] Restringir `:id` a números con regex (`:id(\\d+)`). (no se lo que es)
- [ ] No usar `@Body()` en GET de findAll. (creo queno lo hacemos en ninguno, revisar)
- [ ] Prefijos consistentes (ej: `/api`). (esto si falta, nunca lo agregamos)

## Servicios (reglas)

- [ ] Validar existencia de FK antes de crear entidades. (confiemos en el orm)
- [ ] Historial de precios: insertar nuevo en lugar de editar. (esto es una pelotudez creo)
- [ ] Chequeo de colisiones en turnos (stylist + hora). (esto si que es interesante y lo tenemos que hacer)
- [ ] Usar `HttpException` en lugar de `Error`. (implementar)

## Middleware / Interceptors / Filters

- [ ] Middleware de logging. (obviamente esto falta, investigar)
- [ ] Exception Filter global. (por supuesto que falta, invstigar)
- [ ] Interceptor de logging o mapeo de respuesta. (ni idea de lo que es eso del mapeo, investigar)

## Autenticación / Autorización

- [ ] Auth JWT básico (login/registro). (esto es de los guards creo, interesante)
- [ ] AuthGuard para rutas privadas. (ni idea que es)
- [ ] RolesGuard simple (admin/stylist/client). (ni idea que es)
- [ ] Proteger endpoints de escritura. (ni idea que es)

## Pagos

- [ ] DTO de Payment (usar números o centavos enteros). (creo que hecho)
- [ ] Validar appointment existente antes de crear. (esto falta, tiene que haber solo un payment por apointment)
- [ ] No depender de AUTO_INCREMENT como correlativo.

## Testing

- [ ] E2E básico con `@nestjs/testing` + `supertest`. (xd)
- [ ] Seed de datos para tests locales. (xd)

## Documentación

- [ ] Swagger con DTOs anotados.
- [ ] README con instrucciones completas.

## DX / Scripts

- [ ] Scripts útiles en package.json.
- [ ] ESLint/Prettier configurados.
- [ ] Logger de Nest configurado.

## Quick wins

- [ ] Prefijo global `/api`.
- [ ] CORS + Helmet.
- [ ] Endpoint `/health` para healthcheck.
