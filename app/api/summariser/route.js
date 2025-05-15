import OpenAI from "openai";
import { NextResponse } from "next/server";

const model = new OpenAI({
    apikey : "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"
})

export async function POST(req){
    const body = await req.json();
    const prompt = body.prompt;

    const response = await model.responses.create({
        model: "gpt-4.1",
        input: prompt,
    });

    const answer = response.output_text;
    return NextResponse.json({ result: answer });
}
