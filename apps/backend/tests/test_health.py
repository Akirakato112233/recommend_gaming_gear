from fastapi.testclient import TestClient

from app.main import create_app


app = create_app(create_tables=False)
client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "fastapi-backend"}
