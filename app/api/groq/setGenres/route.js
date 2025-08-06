import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not configured');
}

const GENRE_WEIGHTS = [1.0, 0.7, 0.4];

export async function POST(req) {
  try {
    const { name, author } = await req.json();

    if (!name || !author) {
      return NextResponse.json({ 
        error: "Missing book name or author" 
      }, { status: 400 });
    }

    const model = new ChatGroq({
      model: "llama3-70b-8192",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY
    });

    const messages = [
      new SystemMessage(
        "Your task is to classify a book using exactly three genres. The genres should be selected from a general genre vocabulary (e.g., 'fantasy', 'romance', 'science fiction', 'historical', 'thriller', etc.). Avoid overly specific subgenres (e.g., 'dark academia', 'steampunk'). The goal is to make these genres useful for broad recommendation purposes. Rank the genres by relevance — the most dominant genre first. Use all lower caps. Use a simple comma-separated format like: fantasy, romance, thriller."
      ),
      new HumanMessage(
        `What are the three most appropriate genres for the book titled '${name}' by ${author}? Return only the three genre names in a list form in order of relevance, no explanations.`
      )
    ];

    const response = await model.invoke(messages);
    const genres = response.content.split(',').map(genre => genre.trim());

    if (!Array.isArray(genres) || genres.length === 0) {
      throw new Error("Invalid genre format received from AI");
    }

    const genreData = genres.slice(0, GENRE_WEIGHTS.length).map((genre, index) => ({
      genre,
      weight: GENRE_WEIGHTS[index]
    }));

    return NextResponse.json({ genreData });
  } catch (error) {
    console.error("Genre classification error:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}