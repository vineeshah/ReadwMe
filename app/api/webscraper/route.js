import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promises as fs } from 'fs';

// Helper function to execute commands as promises with timeout
function execPromise(command, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const process = exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
    
    // Set a timeout to kill the process if it takes too long
    const timeout = setTimeout(() => {
      process.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
    }, timeoutMs);
    
    // Clear the timeout if the process completes before the timeout
    process.on('close', () => clearTimeout(timeout));
  });
}

export async function POST(req) {
  try {
    const book = await req.json();
    
    // Create a search query
    const prompt = `book review ${book.name} by ${book.author}`;
    const searchQuery = encodeURIComponent(prompt);
    
    // Get the current directory
    const currentDir = process.cwd();
    const scriptPath = path.join(currentDir, 'scripts', 'webscraper.js');
    
    // Check if the script exists
    try {
      await fs.access(scriptPath);
      console.log(`Script found at: ${scriptPath}`);
    } catch (err) {
      console.error(`Script not found at: ${scriptPath}. Error: ${err.message}`);
      return NextResponse.json({ 
        error: 'Scraper script not found'
      }, { status: 500 });
    }
    
    console.log(`Executing: node "${scriptPath}" "${searchQuery}"`);
    
    try {
      // Execute the script with the search query
      const { stdout, stderr } = await execPromise(`node "${scriptPath}" "${searchQuery}"`, 90000);
      
      if (stderr) {
        console.error('Script stderr:', stderr);
      }
      
      console.log('Script execution completed');
      
      // Parse the output from the script to get the screenshot
      const result = JSON.parse(stdout);
      
      if (!result.screenshot) {
        throw new Error('No screenshot returned from scraper');
      }
      
      // Just return the screenshot as base64 data URL
      return NextResponse.json({ 
        screenshot: `data:image/png;base64,${result.screenshot}`
      });
    } catch (execError) {
      console.error('Script execution failed:', execError);
      return NextResponse.json({ 
        error: 'Failed to capture screenshot',
        message: execError.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}