# Backend Reference — geo-trails-api

## Module Anatomy

All feature modules follow this pattern:

```
<feature>/
  <feature>.module.ts      NestJS module — imports, providers, exports
  <feature>.controller.ts  REST endpoints
  <feature>.service.ts     Business logic
  <feature>.types.ts       DTOs, interfaces, enums
  <feature>.entity.ts      Domain model class
  <feature>.schema.ts      Mongoose @Schema decorated class
  <feature>.spec.ts        Jest tests
```

## Current Endpoint Registry

| Method | Path | Auth | Controller |
|--------|------|------|------------|
| GET | `/` | No | AppController |
| POST | `/v1/users` | No | UserController |
| GET | `/v1/users/me` | Yes | UserController |
| GET | `/v1/users/:id` | Yes | UserController |
| PATCH | `/v1/users/:id` | Yes | UserController |
| DELETE | `/v1/users/:id` | Yes | UserController |
| POST | `/v1/auth/login` | No | AuthController |
| POST | `/v1/auth/register` | No | AuthController |
| * | `/v1/adventures/*` | Yes | AdventureController |

## Naming Conventions

- Files: `kebab-case` with suffix — `user.service.ts`, `auth.module.ts`
- Classes: PascalCase with suffix — `UserService`, `AuthModule`, `AdventureController`
- DTOs/types: in `<feature>.types.ts`, interfaces and classes (no `Dto` suffix enforced)
- JSON fields: `snake_case` in API responses
- Database fields: camelCase in Mongoose schema, `snake_case` in JSON via transform
