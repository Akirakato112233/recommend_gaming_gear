# Mouse Seed References

Seed date: 2026-05-27

This is a first-pass catalog for popular gaming mice with Thailand availability signals. It is designed for the mouse-only MVP and should be treated as curated seed data, not live commerce data.

The MVP seed has one structured layer:

- `apps/backend/prisma/data/seed-mouse-catalog.ts`: core mouse traits for matching.
- `apps/backend/prisma/data/seed-mouse-prices.ts`: Thai price references when found; missing prices use `-1`.

Store links and shop trust are intentionally out of scope for the MVP. Thailand availability is used only as a seed inclusion filter.
Sensor, DPI, polling rate, switch type, and click latency are also intentionally out of the MVP seed because they do not drive the first version of Mouse Fit Analysis.

Review notes, Reddit opinions, and long pros/cons should live in RAG documents instead of the core mouse table.

## Source Policy

- Popularity and specs are primarily based on the ProSettings gaming mice list: https://prosettings.net/gear/lists/mice/
- Thailand/community availability signals may be used to decide which mice belong in the catalog, but the MVP seed does not store buying links or prices.
- Thai price references are currently sourced from JIB and Ponnie Review when a clear match exists. Any mouse without a clear Thai price match gets `priceThb: -1`.
- Reddit/community references are stored as search links first. Do not quote comments in the product UI until a human reviews the exact thread and date.

## Included Mice

The current seed uses the shortlist selected by the product owner. It intentionally keeps only mouse-fit fields, not full spec-sheet data.

Current count: 140 mice.

## Deferred Offer Data

Price and buying links should be added after the fit MVP works. Keep that data separate from the mouse catalog because prices, vouchers, stock, warranty terms, and seller trust change quickly.

Models without a clear Thailand availability signal were intentionally left out of this MVP seed.

## Next Data Cleanup

- Split model variants that matter for fit, such as Pulsar X2 size variants and ATK A9 variants.
- Add official product-page references for exact dimensions, weight, sensor, and polling rate.
- Replace Reddit search links with reviewed thread references only after checking the exact comment context.
- Add shop metadata later before commerce features: shop name, warranty type, seller trust level, last checked date, and stock status.
- Keep ranking independent from product links when the offer layer is added. Product links should be optional follow-up actions after Mouse Trait Match.
