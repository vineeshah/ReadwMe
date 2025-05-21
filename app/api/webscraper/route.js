import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
    const book = await req.json();
  
    const prompt = `recent pop culture news${book.name} from ${book.author}`;
    const searchQuery = encodeURIComponent(prompt);
    const url = `https://www.google.com/search?q=${searchQuery}`;
  
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--proxy-server=http://65.108.232.33:60006'
        ],
    
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  
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