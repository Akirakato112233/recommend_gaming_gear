import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gear = await prisma.gear.findMany({
      orderBy: [{ score: "desc" }, { priceCents: "asc" }],
    });

    return Response.json({
      items: gear.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        priceCents: item.priceCents,
        score: item.score,
        description: item.description,
      })),
    });
  } catch {
    return Response.json(
      {
        items: [],
        status: "error",
        database: "unavailable",
      },
      { status: 503 },
    );
  }
}
