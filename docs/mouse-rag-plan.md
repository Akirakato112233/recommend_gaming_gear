# Mouse RAG Plan

Use RAG for explanation and evidence, not for deterministic matching.

## Put This In Postgres

- Mouse identity: brand, model, display name, slug
- Matching traits: shape, size class, weight, dimensions, hump position, support level
- Compatibility tags: grip compatibility and aim compatibility

These fields need filtering, ranking, and tests. Keep them structured.

Price and buying links are not part of the MVP. Add them later as a separate `MouseOffer` or `MouseAvailability` table when the product is ready for Thailand availability filtering.

## Put This In RAG

- Review summaries from trusted reviewers
- Reddit and community feedback after manual review
- Common complaints such as coating, side flex, click feel, battery, QC, and warranty stories
- Comparisons such as "Viper V3 Pro vs GPX2" or "EC2-DW vs Xlite V3"
- Product positioning notes such as "safe shape", "rear hump claw mouse", or "budget Viper-style option"

These fields are better as documents because they are long, messy, opinionated, and change over time.

Thai buying notes such as shop reputation, warranty comments, import risk, and price movement should wait until the offer layer exists.

## RAG Document Shape

```json
{
  "mouseSlug": "razer-viper-v3-pro",
  "sourceType": "reddit_thread",
  "sourceTitle": "Community discussion title",
  "sourceUrl": "https://example.com",
  "publishedAt": "2026-05-27",
  "language": "en",
  "summary": "Short neutral summary.",
  "positiveSignals": ["shape feels safe", "good sensor"],
  "negativeSignals": ["price is high", "large for small hands"],
  "fitSignals": ["medium-large symmetric", "claw or hybrid"],
  "confidence": "medium"
}
```

## Answering Rule

The app should rank mice from Postgres traits first. RAG should then explain the pick, add trade-offs, and cite evidence. If RAG conflicts with structured traits, structured traits win until a human updates the catalog.
