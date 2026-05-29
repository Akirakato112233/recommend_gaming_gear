# Recommend Gaming Gear Backend

FastAPI backend skeleton for the project.

## Structure

The project follows the layered FastAPI layout from the referenced best-practices
article:

- `app/main.py` - FastAPI application entry point
- `app/routers/` - public API routes
- `app/core/` - configuration and core settings
- `app/db/` - database engine/session setup
- `app/dependencies.py` - shared FastAPI dependencies
- `app/models/` - future SQLAlchemy models
- `app/schemas/` - Pydantic schemas
- `app/services/` - future business logic
- `app/internal/` - future internal-only routes/tools
- `tests/` - API tests

## Getting Started

Install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 3001
```

Run tests:

```bash
pytest
```

Health check:

```bash
curl http://localhost:3001/api/health/
```

Validate a profile without saving:

```bash
curl -X POST http://localhost:3001/api/profile/validate \
  -H "Content-Type: application/json" \
  -d '{
    "game": "valorant",
    "dpi": 800,
    "sensitivity": 0.32,
    "grip_style": "claw",
    "hand_length_mm": 185,
    "hand_width_mm": 95.5,
    "current_mouse": {
      "mouse_name": "Logitech G Pro X Superlight",
      "likes": ["เบา", "wireless", "balance"],
      "dislikes": ["ลื่น", "click ไม่ชอบ"]
    },
    "preference": {
      "preferred_shape": "symmetric",
      "connectivity": "wireless_only",
      "budget_min_thb": 3000,
      "budget_max_thb": 6000,
      "thailand_only": true
    }
  }'
```

Save after a successful recommendation:

```bash
curl -X POST http://localhost:3001/api/recommendations/complete \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "game": "valorant",
      "dpi": 800,
      "sensitivity": 0.32,
      "grip_style": "claw",
      "hand_length_mm": 185,
      "hand_width_mm": 95.5,
      "current_mouse": {
        "mouse_name": "Logitech G Pro X Superlight",
        "likes": ["เบา", "wireless", "balance"],
        "dislikes": ["ลื่น", "click ไม่ชอบ"]
      },
      "preference": {
        "preferred_shape": "symmetric",
        "connectivity": "wireless_only",
        "budget_min_thb": 3000,
        "budget_max_thb": 6000,
        "thailand_only": true
      }
    },
    "recommendation_summary": "Matched with a light symmetric wireless mouse."
  }'
```

Read the latest profile:

```bash
curl http://localhost:3001/api/profiles/
```

Read a profile by id:

```bash
curl http://localhost:3001/api/profiles/<profile-id>
```

## Database Schema

The MVP stores profile data in Postgres with SQLAlchemy:

- `user_sessions` - anonymous user sessions
- `mouse_fit_profiles` - game, DPI, sensitivity, grip, hand size, current mouse feedback, and preferences
- `diagnostic_results` - placeholder table for future aim-test metrics and trait summaries

Profile data is saved only after `POST /api/recommendations/complete` succeeds.
Tables are created automatically on API startup for the MVP. Add Alembic before
production migrations become important.
