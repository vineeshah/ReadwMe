import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import OpenAI from "openai";
import { FAISS } from "langchain/vectorstores/faiss";

// Important: disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const uploadDir = "./uploads";

  try {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return new NextResponse(JSON.stringify({ error: "Invalid content type." }), {
        status: 400,
      });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return new NextResponse(JSON.stringify({ error: "Boundary not found." }), {
        status: 400,
      });
    }

    const decoder = new TextDecoder();
    const body = await req.body.getReader().read();
    const content = decoder.decode(body.value);

    const parts = content.split(`--${boundary}`);
    const filePart = parts.find((part) => part.includes("Content-Disposition: form-data; name=\"file\"; filename="));

    if (!filePart) {
      return new NextResponse(JSON.stringify({ error: "No file received." }), {
        status: 400,
      });
    }

    const filenameMatch = filePart.match(/filename="(.+?)"/);
    const originalFilename = filenameMatch?.[1];
    if (!originalFilename) {
      return new NextResponse(JSON.stringify({ error: "Filename not found." }), {
        status: 400,
      });
    }

    const fileContent = filePart.split("\r\n\r\n")[1].split("\r\n--")[0];
    const filePath = path.join(uploadDir, originalFilename);

    fs.writeFileSync(filePath, fileContent);

    const CHUNK_SIZE = 800;
    const CHUNK_OVERLAP = 100;

    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true
    });

    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);

    const chunks = [];
    for (let i = 0; i < data.text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      chunks.push(text.slice(i, i + CHUNK_SIZE));
    }
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    });
    const vectors = response.data.map(item => item.embedding);

    const vectorstore = await FAISS.fromVectors(vectors, chunks);
    await vectorstore.save("./faiss_index");



    return new NextResponse(
      JSON.stringify({
        message: "File uploaded successfully",
        filePath,
        originalName: originalFilename,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: "Upload failed." }), {
      status: 500,
    });
  }

  
}
