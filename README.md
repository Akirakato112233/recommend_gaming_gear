# Recommend Gaming Gear

Local gaming mouse recommendation app that combines user profile data, diagnostic feedback, mouse catalog filtering, RAG evidence, and a local LLM summary.

The current flow is:

1. User fills a mouse-fit profile in the frontend.
2. User can run simple diagnostic pages and save session feedback.
3. Backend filters catalog mice by grip style and budget.
4. Backend retrieves RAG chunks for the filtered candidate mice.
5. Backend sends profile + session context + evidence chunks to a local Ollama model.
6. Frontend shows the AI recommendation summary and the evidence chunks used.

## Stack

- `apps/frontend`: Next.js App Router frontend on port `3000`
- `apps/backend`: FastAPI backend on port `3001`
- `db`: PostgreSQL + pgvector
- Local LLM: Ollama, default chat model `qwen3:8b`
- Embeddings: Ollama `embeddinggemma`
- Docker Compose for the full local stack

## App Pages

- `http://localhost:3000/` - profile form and diagnostic links
- `http://localhost:3000/tracking` - tracking diagnostic
- `http://localhost:3000/flick` - flick diagnostic
- `http://localhost:3000/micro-adjustmest` - micro-adjustment diagnostic
- `http://localhost:3000/analysis` - AI summary page

## Requirements

- Docker Desktop
- Node.js and npm, for local frontend commands
- Python 3.11+ if running the backend outside Docker
- Ollama running on the host machine
- Ollama models:

```bash
ollama pull qwen3:8b
ollama pull embeddinggemma
```

Docker Compose passes `http://host.docker.internal:11434` to the backend so the container can reach Ollama on your machine.

## Run With Docker

Start the full stack:

```bash
npm run docker:up
```

Open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`
- pgAdmin: `http://localhost:5050`

Stop the stack:

```bash
npm run docker:down
```

## Seed RAG Data

The AI summary depends on RAG chunks in Postgres. After the backend and database are running, ingest the mouse research data:

```bash
docker compose exec backend python -m app.rag.ingest
```

This reads the local mouse research data, creates embeddings with Ollama, and stores chunks in the `rag_chunks` table.

## Local Development

Start only the database:

```bash
docker compose up db
```

Backend:

```bash
cd apps/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 3001
```

Frontend:

```bash
npm --prefix apps/frontend install
npm --prefix apps/frontend run dev
```

Root scripts:

```bash
npm run frontend:dev
npm run backend:dev
npm run backend:test
```

## Environment

Root `.env.example` contains the basic local values:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gaming_gear
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gaming_gear
APP_NAME=Recommend Gaming Gear API
API_PREFIX=/api
API_URL=http://localhost:3001
```

Backend Docker Compose overrides `DATABASE_URL` to use the `db` service and sets:

```bash
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_EMBEDDING_MODEL=embeddinggemma
EMBEDDING_DIMENSION=768
```

## Key API Endpoints

Health:

```bash
curl http://localhost:3001/api/health
```

List mouse catalog:

```bash
curl http://localhost:3001/api/mice/
```

Filter mice by grip and price:

```bash
curl "http://localhost:3001/api/mice/filter?grip_style=claw&min_price_thb=3000&max_price_thb=6000"
```

Generate the AI recommendation summary:

```bash
curl -X POST http://localhost:3001/api/recommendations/summary \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "game": "valorant",
      "dpi": 800,
      "grip_style": "claw",
      "hand_length_mm": 185,
      "hand_width_mm": 95.5,
      "current_mouse": {
        "mouse_name": "Logitech G Pro X Superlight",
        "likes": ["wireless", "balance"],
        "dislikes": ["ลื่น"]
      },
      "preference": {
        "preferred_shape": "symmetric",
        "connectivity": "wireless_only",
        "budget_min_thb": 3000,
        "budget_max_thb": 6000,
        "thailand_only": true
      }
    },
    "candidate_mouse_ids": [
      "asus-rog-harpe-2-ace",
      "atk-a9",
      "corsair-sabre-v2-pro"
    ],
    "top_k": 8,
    "diagnostic_progress": {
      "tracking": "done",
      "flick": "done",
      "micro": "done"
    },
    "diagnostic_feedback": {
      "tracking": {
        "feel": "นิ่ง / คุมง่าย",
        "note": "tracking สบาย",
        "updatedAt": "2026-06-08T12:00:00.000Z"
      }
    },
    "client_context": "sensitivity: 1.5\nliked features: wireless, lightweight"
  }'
```

## Data Flow Notes

- The frontend stores profile draft, diagnostic progress, and diagnostic feedback in browser `sessionStorage`.
- The analysis page sends session data to the backend only when `Run AI analysis` is clicked.
- `/api/mice/filter` only uses grip style and budget.
- `/api/recommendations/summary` receives profile, diagnostic session data, filtered candidate ids, retrieves RAG evidence, and asks the local LLM for the final summary.
- Catalog mouse ids use hyphens, while RAG chunk ids use underscores. The backend normalizes ids before searching RAG chunks.
- If Ollama is slow or unavailable, the summary service returns a heuristic fallback summary based on evidence chunks.
- The database currently stores only mouse catalog rows and RAG chunks. User profile/session tables were removed because the current frontend flow does not persist them.

## Tests

Backend tests:

```bash
docker compose exec backend pytest
```

Frontend lint:

```bash
npm --prefix apps/frontend run lint
```

Frontend build:

```bash
npm --prefix apps/frontend run build
```

## Project Structure

```text
apps/
  backend/
    app/
      routers/      FastAPI routes
      services/     business logic, ranking, summary, search
      rag/          chunking, embedding, search, ingest
      schemas/      Pydantic request/response models
      models/       SQLAlchemy models
      data/         mouse catalog and research data
    tests/
  frontend/
    src/app/
      page.tsx              profile flow
      analysis/page.tsx     AI recommendation summary
      tracking/page.tsx     diagnostic page
      flick/page.tsx        diagnostic page
      micro-adjustmest/     diagnostic page
docs/
docker-compose.yml
```
