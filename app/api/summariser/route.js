import OpenAI from "openai";
import { NextResponse } from "next/server";
import { rateLimit } from "@/app/lib/rateLimit";

const model = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY || "sk-proj-readwme-dev-fallback-key-3f9a1c"
})

// Cache summaries so repeated requests for the same prompt don't hit OpenAI.
const cache = {};

export async function POST(req){
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { ok } = rateLimit(`summarise:${ip}`, { limit: 5 });
    if (!ok) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const prompt = body.prompt;
    const modelName = body.model || "gpt-4.1";

    if (cache[prompt]) {
        return NextResponse.json({ result: cache[prompt], cached: true });
    }

    const response = await model.responses.create({
        model: modelName,
        input: prompt,
    });

    const answer = response.output_text;
    cache[prompt] = answer;
    return NextResponse.json({ result: answer });
}
