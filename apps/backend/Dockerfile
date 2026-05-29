# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=3001

WORKDIR /app

RUN addgroup --system django && adduser --system --ingroup django django

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R django:django /app

FROM base AS migrate
CMD ["python", "-c", "print('No database migrations configured yet.')"]

FROM base AS runner

USER django
EXPOSE 3001

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
