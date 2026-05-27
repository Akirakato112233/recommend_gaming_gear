export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase text-emerald-300">
          Backend API
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Gaming gear service</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            className="border border-zinc-700 bg-zinc-900 p-5 transition hover:border-emerald-400"
            href="/api/health"
          >
            <span className="block text-sm text-zinc-400">GET</span>
            <strong>/api/health</strong>
          </a>
          <a
            className="border border-zinc-700 bg-zinc-900 p-5 transition hover:border-emerald-400"
            href="/api/gear"
          >
            <span className="block text-sm text-zinc-400">GET</span>
            <strong>/api/gear</strong>
          </a>
        </div>
      </section>
    </main>
  );
}
