import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();
import { ChatOpenAI } from "@langchain/openai";

export default async function validbook(data) {
  const name = data.name;
  const author = data.author;
//   if (!process.env.OPENAI_API_KEY) {
//     console.error("Error: The OPENAI_API_KEY environment variable is missing or empty.");
//     return false; 
//   }

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: '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',
  });

  const messages = [
    new SystemMessage("Only respond with 'Yes' or 'No'."),
    new HumanMessage(`Is '${name}' by '${author}' a valid book? Answer based on whether that book exists or not.`),
  ];

  try {
    const response = await model.invoke(messages);
    return response.content.trim() === "Yes";
  } catch (error) {
    console.error("Error validating book:", error);
    return false; 
  }
}