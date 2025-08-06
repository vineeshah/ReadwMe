import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

export default async function setGenres(data) {
  // console.log("setGenres function called with data:", data); 
  const name = data.name;
  const author = data.author;
  if (!data || !data.name || !data.author) {
    console.error("Missing required data for setGenres");
    return false;
  }
  // const id = data.bookid;

    const model = new ChatGroq({
        model: "llama3-70b-8192",
        temperature: 0,
        apiKey: process.env.GROQ_API_KEY,
        // response_format: {
        //   type: "json_object",
        //   schema: {
        //     type: "object",
        //     properties: {
        //       genres: {
        //         type: "array",
        //         items: { type: "string" },
        //         minItems: 3,
        //         maxItems: 3
        //       }
        //     },
        //     required: ["genres"]
        //   }
        // },
    });

  const messages = [
    new SystemMessage(
        "Your task is to classify a book using exactly three genres. The genres should be selected from a general genre vocabulary (e.g., 'fantasy', 'romance', 'science fiction', 'historical', 'thriller', etc.). Avoid overly specific subgenres (e.g., 'dark academia', 'steampunk'). The goal is to make these genres useful for broad recommendation purposes. Rank the genres by relevance — the most dominant genre first. Use all lower caps. Use a simple comma-separated format like: fantasy, romance, thriller."
      ),
      
      new HumanMessage(
        `What are the three most appropriate genres for the book titled '${name}' by ${author}? Return only the three genre names in a list form in order of relevance, no explanations.`
      ),
      
  ];
  const weights = [1.0, 0.7, 0.4]
  // console.log("Attempting to call Groq API...");

  try {
    // console.log("Messages being sent to Groq:", messages);
    const response = await model.invoke(messages);
    const data = response.content
    // console.log("Raw grok response:", response)
    // console.log("Raw grok content:", data)



    const genres = data.split(',').map(genre => genre.trim());    
    // console.log("new format:", genres)
    if (!Array.isArray(genres) || genres.length === 0) {
      throw new Error("Invalid genre format: Expected an array of strings.");
    }

    const genreData = genres.slice(0, weights.length).map((genre, index) => ({
        genre,
        weight : weights[index]
    }))
    return genreData;
  } catch (error) {
    console.error("Error in the response format of the llm:", error);
    return false; 
  }
}