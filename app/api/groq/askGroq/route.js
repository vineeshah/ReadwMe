import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not configured');
}

export async function POST(req) {
  try {
    const { similarity, books } = await req.json();
    
    const model = new ChatGroq({
      model: "llama3-70b-8192",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY
    });

    const messages = [
        new SystemMessage(
            "You are a book recommendation system. Provide exactly 10 book recommendations based on the user's reading history and requested similarity level. Format your response as a JSON array of objects, where each object has 'name' and 'author' fields. Example format: [{\"name\": \"Book Title\", \"author\": \"Author Name\"}]. Ensure similarity level (1-10) influences how closely the recommendations match the user's existing books in terms of genre and style. Make sure you dont keep recommending the same books for the highst and lowest level."
        ),
        new HumanMessage(
            `Please recommend books with a similarity level of ${similarity} (where 10 means very similar and 1 means loosely similar) based on these books: ${JSON.stringify(books)}. Return only the JSON array.`
        )
    ];

    const response = await model.invoke(messages);
    const recommendations = JSON.parse(response.content);
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("GROQ API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}