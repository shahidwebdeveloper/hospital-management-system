# API Design

Base URL: `/api/v1`

## Health

- `GET /health` - API status and uptime

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

## Management Modules

- `/users`
- `/departments`
- `/doctors`
- `/patients`
- `/appointments`
- `/medical-records`
- `/prescriptions`
- `/laboratory`
- `/pharmacy`
- `/billing`
- `/notifications`

## API Conventions

- JSON request and response bodies
- JWT access token authorization
- Role-based route guards
- Zod validation before controller logic
- Consistent error response format
- Pagination, sorting, and filtering for list endpoints
