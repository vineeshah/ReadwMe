import OpenAI from "openai";
import { NextResponse } from "next/server";

const model = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
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
