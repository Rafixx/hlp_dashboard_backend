# AGENTS.md — Guía de Buenas Prácticas

Este documento define convenciones mínimas para el desarrollo, asegurando calidad, mantenibilidad y consistencia dentro de los proyectos del stack habitual (React + Vite, Node.js + Express + TypeScript, Sequelize, PostgreSQL, Clean Architecture).

---
## 📘 1. Estándares Generales
- Código escrito en **TypeScript** siempre que sea posible.
- Evitar *code smells*: funciones largas, alta anidación, variables ambiguas.
- Mantener **pure functions** cuando aplique.
- Evitar estados globales no controlados.
- No asumir comportamiento: validar entradas.
- Incluir comentarios sólo donde aporten valor.

---
## 🔤 2. Nomenclatura
- `camelCase` para variables, funciones y atributos.
- `PascalCase` para clases, componentes React y tipos.
- `SNAKE_CASE` para constantes globales.
- Evitar abreviaturas no estándar.
- Nombres descriptivos: evitar `tmp`, `data1`, `foo`, `bar`.

Ejemplos:
```ts
const scaleFactor = 0.8;
class UserController {}
interface CreateUserDto {}
const JWT_SECRET = "...";
```

---
## 📁 3. Estructura de Proyecto

### Backend (Node.js + Express)
```
src/
  app.ts
  server.ts
  config/
  routes/
  controllers/
  services/
  repositories/
  models/
  middlewares/
  utils/
```

### Frontend (React + Vite)
```
src/
  components/
  hooks/
  pages/
  features/
    users/
      components/
      services/
      hooks/
      types/
  shared/
    components/
    services/
    constants/
    utils/
```

---
## 🧱 4. API y Backend

- Rutas RESTful.
- Validar input desde DTO/validator (p. ej. Zod o Joi).
- Middleware global para errores.
- Nada de lógica de negocio en rutas; delegar a servicios.
- Evitar dependencias directas a la base — usar repositorios.
- JWT para autenticación.

Ejemplo handler:
```ts
router.post('/login', controller.login);
```

Ejemplo controller:
```ts
export const login = async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  res.json(result);
};
```

---
## 🏗️ 5. Frontend
- Componentes pequeños y específicos.
- Inteligencia en hooks/servicios, no en componentes.
- Evitar efectos secundarios en render.
- Preferir SWR/React Query para data fetching.
- Mantener la UI declarativa.

---
## ✅ 6. Testing
- Unit tests en servicios, utils y hooks.
- Integration tests para endpoints clave.
- E2E opcional (Playwright/Cypress) para journeys principales.

---
## 🔐 7. Seguridad
- **Nunca** subir `.env` a repositorios.
- Rotar secretos.
- Sanitizar inputs.
- Validar `Content-Type`.
- HTTPS obligatorio.
- CORS configurado correctamente.
- No exponer información sensible en errores.

---
## 🚀 8. Git & CI/CD
- `main` siempre estable.
- PRs con revisión obligatoria.
- `commitlint` + Conventional Commits.
- CI ejecuta build + tests.
- Deploy automático a entornos.

---
## 📦 9. Base de datos
- Usar migraciones.
- Nombres representativos.
- Tipos estrictos.
- Foreign keys siempre.
- Evitar cascadas destructivas sin revisar.

---
## ⚙️ 10. Logs & Observabilidad
- Usar logger (p. ej. `pino`, `winston`).
- No usar `console.log` en producción.
- Trazabilidad mínima: timestamp + msg + user + requestId.

---
## 🧹 11. Limpieza
- Eliminar imports no usados.
- Evitar dejar código comentado.
- Revisar warnings.

---
## 📄 12. Documentación
- README en cada repo.
- Documentar endpoints en OpenAPI.
- Comentarios en funciones complejas.

---
## 🤝 13. Revisión de Código
- Buscar simplicidad.
- Comentar mejoras.
- Preguntar ante duda.
- No aprobar sin entender.

---
## 🏆 14. Principios
- KISS — Keep It Simple, Stupid.
- DRY — Don't Repeat Yourself.
- YAGNI — You Aren't Gonna Need It.
- SOC — Separation of Concerns.
- SRP — Single Responsibility Principle.

---
## ✅ 15. Checklist PR
- [ ] Nombres claros
- [ ] Sin duplicaciones
- [ ] Tests OK
- [ ] Linter OK
- [ ] Documentación actualizada
- [ ] Sin código muerto

---
## ⚠️ Anti‑Patrones
- God objects
- Rutas gordas
- Servicios mega‑clase
- `any` everywhere
- SQL incrustado en controladores
- `fetch`/axios en componentes

---
## 📌 Ejemplo DTO + Service
```ts
interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

class UserService {
  async create(dto: CreateUserDto) {
    // validate, hash, save
  }
}
```

---
## 🧩 Ejemplo Hook Limpio
```ts
export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: api.getUsers })
}
```

---
## 🏁 Cierre
Este documento sirve como guía compartida. La prioridad es facilitar desarrollo seguro, mantenible y consistente.

