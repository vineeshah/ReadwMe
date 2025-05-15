import { getJson } from "serpapi";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { book } = await req.json();

  try {
    const prompt = `recent pop culture news about ${book.name} from ${book.author}`;
    const result = await getJson({
      engine: "google",
      q: prompt,
      api_key: "9d9100525b33abc655ea787b9733f2c0140ba3f566b04169a68174f1b8fc619d",
    });

    const firstLink = result.organic_results?.[0]?.link;
    const title = result.organic_results?.[0]?.title;

    return NextResponse.json({ firstLink, title });
  } catch (err) {
    console.error("🛑 SerpAPI failed:", err);
    return NextResponse.json({ error: "SerpAPI failed" }, { status: 500 });
  }
}
