# Recommend Gaming Gear Backend

FastAPI backend for the current mouse recommendation flow.

## What It Does

- Seeds and serves the mouse catalog.
- Filters mice by grip style and price.
- Stores RAG chunks with pgvector embeddings.
- Retrieves RAG evidence for filtered candidate mice.
- Sends profile + diagnostic session context + evidence chunks to local Ollama.
- Returns an AI summary and the evidence chunks used.

The backend no longer persists user profile/session data. The frontend keeps profile and diagnostic state in browser `sessionStorage` and sends it to `/api/recommendations/summary` only when the user runs analysis.

## Structure

- `app/main.py` - FastAPI application entry point
- `app/routers/health.py` - health check
- `app/routers/mice.py` - mouse catalog and filter API
- `app/routers/recommendations.py` - AI summary API
- `app/services/` - catalog filtering, RAG ranking, LLM summary
- `app/rag/` - chunking, embedding, search, ingest
- `app/models/` - SQLAlchemy models for mouse catalog and RAG chunks
- `app/schemas/` - Pydantic request/response models
- `tests/` - API and service tests

## Run

From the repository root:

```bash
npm run docker:up
```

Backend URL:

```bash
http://localhost:3001
```

Health check:

```bash
curl http://localhost:3001/api/health
```

## Seed RAG Data

After Docker is running:

```bash
docker compose exec backend python -m app.rag.ingest
```

This creates embeddings with Ollama `embeddinggemma` and stores chunks in `rag_chunks`.

## Main Endpoints

Filter mice:

```bash
curl "http://localhost:3001/api/mice/filter?grip_style=claw&min_price_thb=3000&max_price_thb=6000"
```

Generate recommendation summary:

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
    "diagnostic_feedback": {},
    "client_context": "sensitivity: 1.5"
  }'
```

## Tests

```bash
docker compose exec backend pytest
```
