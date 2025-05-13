import formidable from "formidable";
// import fs from "fs-extra";
import { NextResponse } from "next/server";

// Important: disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = formidable({
    uploadDir: "./uploads",       // Where to save uploaded files
    keepExtensions: true,         // Keep the original file extension (.pdf)
    multiples: false,             // Only accept 1 file
  });

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = files.pdf?.[0]; // assumes the file field is named "pdf"

    if (!uploadedFile) {
      return new Response(JSON.stringify({ error: "No file received." }), {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "File uploaded successfully",
        filePath: uploadedFile.filepath, // you can use this later for PDF parsing
        originalName: uploadedFile.originalFilename,
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
