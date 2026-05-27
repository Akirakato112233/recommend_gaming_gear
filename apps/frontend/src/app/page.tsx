import { connection } from "next/server";

type GearItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceCents: number;
  score: number;
  description: string;
};

type GearResponse = {
  items: GearItem[];
};

async function loadGearRecommendations() {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";

  try {
    const response = await fetch(`${apiUrl}/api/gear`);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = (await response.json()) as GearResponse;
    return data.items;
  } catch {
    return [];
  }
}

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}

export default async function Home() {
  await connection();

  const gear = await loadGearRecommendations();

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-zinc-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 border-b border-zinc-300 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              Recommend Gaming Gear
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Practical picks for competitive setups.
            </h1>
          </div>
          <div className="grid min-w-48 grid-cols-2 gap-3 text-sm">
            <div className="border border-zinc-300 bg-white px-4 py-3">
              <span className="block text-zinc-500">Backend</span>
              <strong className="text-emerald-700">Next.js API</strong>
            </div>
            <div className="border border-zinc-300 bg-white px-4 py-3">
              <span className="block text-zinc-500">Database</span>
              <strong className="text-rose-700">Postgres</strong>
            </div>
          </div>
        </header>

        {gear.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {gear.map((item) => (
              <article
                className="border border-zinc-300 bg-white p-5 shadow-sm"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase text-zinc-500">
                      {item.category}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {item.brand} {item.name}
                    </h2>
                  </div>
                  <div className="min-w-16 border border-emerald-700 px-3 py-2 text-center text-emerald-800">
                    <span className="block text-xs uppercase">Score</span>
                    <strong className="text-xl">{item.score}</strong>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-zinc-600">
                  {item.description}
                </p>
                <p className="mt-5 text-lg font-semibold text-zinc-900">
                  {formatPrice(item.priceCents)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-amber-300 bg-amber-50 p-5 text-amber-950">
            Backend data is not available yet. Start the Docker stack or run the
            backend on port 3001.
          </div>
        )}
      </section>
    </main>
  );
}
