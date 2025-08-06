import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not configured');
}

export async function POST(req) {
  try {
    const { name, author } = await req.json();

    if (!name || !author) {
      return NextResponse.json({ 
        error: "Missing title or author" 
      }, { status: 400 });
    }

    const model = new ChatGroq({
      model: "llama3-70b-8192",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY
    });

    const messages = [
      new SystemMessage(
        "Respond only with 'Yes', 'No', or 'Retry'. If the book name or author is incomplete, incorrect, or needs clarification, respond with 'Retry'. If the book does not exist, respond with 'No'. If the book exists, respond with 'Yes'. Also, for the name of a book that is part of a series, only accept the books full name or 'No'"
      ),
      new HumanMessage(
        `Is '${name}' by '${author}' a valid book? Answer based on whether that book exists or not.`
      )
    ];

    const response = await model.invoke(messages);
    const result = response.content.trim();

    return NextResponse.json({ isValid: result });
  } catch (error) {
    console.error("Book validation error:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}