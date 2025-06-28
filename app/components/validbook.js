import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import dotenv from 'dotenv';
// dotenv.config();
import { ChatGroq } from "@langchain/groq";




export default async function validbook(data) {
  const name = data.name;
  const author = data.author;
  
//   if (!name || !author) {
//     console.error("Missing title or author");
//     return false;
//   }

//   const genAI = new GoogleGenerativeAI("AIzaSyC6btwppwl0ah6udYB24lhaJZHWQArKlhk");
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const model = new ChatGroq({
        model: "llama3-70b-8192",
        temperature: 0,
        apiKey: "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"
    });

  const messages = [
    new SystemMessage("Respond only with 'Yes', 'No', or 'Retry'. If the book name or author is incomplete, incorrect, or needs clarification, respond with 'Retry'. If the book does not exist, respond with 'No'. If the book exists, respond with 'Yes'. Also, for the name of a book that is part of a series, only accept the books full name or 'No'"),
    new HumanMessage(`Is '${name}' by '${author}' a valid book? Answer based on whether that book exists or not.`),
  ];

  try {
    const response = await model.invoke(messages);
    // const response = await model.generateContent("Only respond with 'Yes' or 'No'." + `Is '${name}' by '${author}' a valid book? Answer based on whether that book exists or not.`)
    return response.content.trim();
  } catch (error) {
    console.error("Error validating book:", error);
    return false; 
  }
}