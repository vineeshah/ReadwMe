import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

export default async function spotifySearch(data) {
  const valence = data.valence
  const energy = data.energy
  const bookname = data.name
  const author = data.author

    const model = new ChatGroq({
        model: "llama3-70b-8192",
        temperature: 0,
        apiKey: process.env.GROQ_API_KEY,
    });

  const messages = [
    new SystemMessage(
        "You're a music search assistant helping to find Spotify playlists or tracks that match the mood of the user and based on the book's genres too. The valence level is from 0-1 (1-happy, 0-sad) and the energy level is also from 0-1(1-intense, 0-calm). Return a list of 2-3 Spotify-style music keywords(only single words) that describe the kind of music that would fit the search query parametres to get the best suitable playlist. Use common or niche Spotify search tags based on what the search would return, be smart about this. Respond with a comma-separated string of keywords only — no extra explanation."
    ),
    new HumanMessage(
        `The Book name is ${bookname} by ${author}, valence level is ${valence}, energy level is ${energy}`
    )
  ];

  try {
    const response = await model.invoke(messages);
    const keywords = response.content.split(',').map(keyword => keyword.trim());
    console.log("keywords",keywords)
    if (!Array.isArray(keywords)) {
        throw new Error('Invalid response format from AI');
    }
    return keywords;
  } catch (error) {
    console.error("Error validating book:", error);
    return false; 
  }
}