"use client"
import { useState } from "react";

export default function Summariser() {
    const [file, setFile] = useState(null);

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