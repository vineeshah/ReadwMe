import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

export default async function askGroq(data) {
  const userId = data.id;
  const similarity = data.sim
  const books = data.books



    const model = new ChatGroq({
        model: "llama3-70b-8192",
        temperature: 0,
        apiKey: "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"
    });

  const messages = [
    new SystemMessage(
        "You are a book recommendation system. Provide exactly 5 book recommendations based on the user's reading history and requested similarity level. Format your response as a JSON array of objects, where each object has 'name' and 'author' fields. Example format: [{\"name\": \"Book Title\", \"author\": \"Author Name\"}]. Ensure similarity level (1-10) influences how closely the recommendations match the user's existing books in terms of genre and style."
    ),
    new HumanMessage(
        `Please recommend books with a similarity level of ${similarity} (where 10 means very similar and 1 means loosely similar) based on these books: ${JSON.stringify(books)}. Return only the JSON array.`
    )
  ];

  try {
    const response = await model.invoke(messages);
    const books = JSON.parse(response.content)
    if (!Array.isArray(books) || !books.every(book => book.name && book.author)) {
        throw new Error('Invalid response format from AI');
    }
    return books;
  } catch (error) {
    console.error("Error validating book:", error);
    return false; 
  }
}