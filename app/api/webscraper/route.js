// import { getJson } from "serpapi";
import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

import puppeteer from "puppeteer";

export async function POST(req) {
    const book = await req.json();
  
    const prompt = `recent pop culture news${book.name} from ${book.author}`;
    const searchQuery = encodeURIComponent(prompt);
    const url = `https://www.google.com/search?q=${searchQuery}`;
  
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
  
    const screenshotBuffer = await page.screenshot({ 
      fullPage: false,
      encoding: 'binary'
    });
    
    const screenshot = screenshotBuffer.toString('base64');

    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h3')).map(el => el.innerText);
    });
  
    await browser.close();
    console.log(titles);
    console.log(screenshot)
  
    return NextResponse.json({ 
      titles,
      screenshot: `data:image/png;base64,${screenshot}`
    });
}