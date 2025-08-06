import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not configured');
}

export async function POST(req) {
  try {
    const { name, author, valence, energy } = await req.json();

    if (!name || !author || valence === undefined || energy === undefined) {
      return NextResponse.json({ 
        error: "Missing required parameters" 
      }, { status: 400 });
    }

    const model = new ChatGroq({
      model: "llama3-70b-8192",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY
    });

    const messages = [
      new SystemMessage(
        "You're a music search assistant helping to find Spotify playlists or tracks that match the mood of the user and based on the book's genres too. The valence level is from 0-1 (1-happy, 0-sad) and the energy level is also from 0-1(1-intense, 0-calm). Return a list of 2-3 Spotify-style music keywords(only single words) that describe the kind of music that would fit the search query parametres to get the best suitable playlist. Use common or niche Spotify search tags based on what the search would return, be smart about this. Respond with a comma-separated string of keywords only — no extra explanation."
      ),
      new HumanMessage(
        `The Book name is ${name} by ${author}, valence level is ${valence}, energy level is ${energy}`
      )
    ];

    const response = await model.invoke(messages);
    const keywords = response.content.split(',').map(keyword => keyword.trim());

    if (!Array.isArray(keywords)) {
      throw new Error('Invalid response format from AI');
    }

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}