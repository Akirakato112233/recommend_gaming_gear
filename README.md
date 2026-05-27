# Recommend Gaming Gear

Monorepo starter for a gaming gear recommendation app.

## Stack

- `apps/frontend`: Next.js App Router frontend on port `3000`
- `apps/backend`: Next.js App Router API on port `3001`
- `db`: PostgreSQL with Prisma migrations
- Docker Compose for the full local stack

## Run With Docker

```bash
npm run docker:up
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health check: http://localhost:3001/api/health

Stop the stack:

```bash
npm run docker:down
```

## Local Development

Start Postgres:

```bash
docker compose up db
```

Apply migrations and generate the Prisma client:

```bash
npm run backend:prisma:migrate
npm run backend:prisma:generate
```

Run the apps in separate terminals:

```bash
npm run backend:dev
npm run frontend:dev
```

## Environment

Use `.env.example` files as references. The backend expects:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gaming_gear?schema=public
```

The frontend reads `API_URL` server-side. Docker Compose sets it to `http://backend:3001`.
