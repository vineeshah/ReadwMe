"use client"
import { useState, useEffect } from "react";

export default function Summariser() {
    const [file, setFile] = useState(null);

    
    // const [vector, setVector] = useState(null);
    
    // const embed = async(text) => {

    //     const response = await openai.embeddings.create({
    //         model: "text-embedding-3-small",
    //         input: text,
    //     });
        
    //     console.log("This is the vector:", response.data[0].embedding);
    
    
    // }

    // useEffect(() => {
        
    //     embed("This is an example paragraph that we want to embed.");
    // }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleUploads = async () => {
        if (!file) {
            console.error("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/files", { method: "POST", body: formData });
            const data = await res.json();
            console.log("File path:", data.filePath);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }; 

    return (
        <div>
            <h1>Upload a File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploads}>Upload</button>
        </div>
    );
}