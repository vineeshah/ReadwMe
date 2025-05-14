import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";

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

    // In Next.js App Router, req is a NextRequest object, not Node's http.IncomingMessage
    // We need to manually process the multipart form data
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Extract boundary from content-type
    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return NextResponse.json({ error: "No boundary found in content-type" }, { status: 400 });
    }

    // Read the request body as a stream
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const originalFilename = file.name || "unnamed.pdf";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file
    const filePath = path.join(uploadDir, originalFilename);
    await fs.promises.writeFile(filePath, buffer);

    console.log("File uploaded successfully:", filePath);

    // Simple text extraction with size limit to prevent token limit issues
    let text = "";
    try {
      // Try to read as plain text, but limit the size
      const rawText = buffer.toString('utf8');
      // Limit to approximately 50K characters to avoid token limits
      text = rawText.substring(0, 50000);
      
      if (rawText.length > 50000) {
        console.log(`File too large (${rawText.length} chars), truncated to 50K chars`);
      }
    } catch (readError) {
      console.error("Error reading as text:", readError);
      text = "Content could not be extracted from the uploaded file.";
    }
    
    const CHUNK_SIZE = 800;
    const CHUNK_OVERLAP = 100;

    // Create chunks from the text
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      chunks.push(text.slice(i, i + CHUNK_SIZE));
    }

    // Limit number of chunks to avoid token limits
    const MAX_CHUNKS = 100;
    const limitedChunks = chunks.slice(0, MAX_CHUNKS);
    
    if (chunks.length > MAX_CHUNKS) {
      console.log(`Too many chunks (${chunks.length}), limited to ${MAX_CHUNKS}`);
    }

    if (limitedChunks.length === 0) {
      limitedChunks.push("Empty document");
    }

    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true
    });

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: limitedChunks,
    });

    const vectors = response.data.map((item) => item.embedding);

    const documents = limitedChunks.map((chunk, i) => new Document({
      pageContent: chunk,
      metadata: {
        page: i + 1,
        source: originalFilename
      }
    }));

    // Create the Pinecone client
    const pinecone = new Pinecone({
      apiKey: "pcsk_7Kg7hF_BzbUrMwaVfWZv5gWrShTURRFDjXQSUKeVMSAp1cSbNY63Taqcw78Hbu2SgjDxRM"
    });
    
    const pineconeIndex = pinecone.Index("readwme");

    // Create embeddings and document pairs for storing
    const embeddings = vectors.map((vector, i) => ({
      id: `${originalFilename}-${i}`,
      values: vector,
      metadata: documents[i].metadata
    }));

    // Use Pinecone's upsert method directly instead of PineconeStore
    await pineconeIndex.upsert(embeddings);

    console.log("File content embedded and stored in Pinecone");

    return NextResponse.json({
      message: "File uploaded successfully",
      filePath,
      originalName: originalFilename,
      embedded: true,
      metadata: documents.map(doc => doc.metadata),
    }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ 
      error: "Upload failed.", 
      details: err.message 
    }, { status: 500 });
  }
}
