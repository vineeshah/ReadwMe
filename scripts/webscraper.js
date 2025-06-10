const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log directory and environment for debugging
console.error(`Current directory: ${process.cwd()}`);
console.error(`Node version: ${process.version}`);

// Install required dependencies if not present
try {
  require.resolve('puppeteer-extra');
  require.resolve('puppeteer-extra-plugin-stealth');
  require.resolve('random-useragent');
  console.error('Dependencies already installed');
} catch (e) {
  console.error('Installing required dependencies...');
  try {
    execSync('npm install puppeteer-extra puppeteer-extra-plugin-stealth random-useragent puppeteer-extra-plugin-anonymize-ua', { stdio: 'inherit' });
    console.error('Dependencies installed successfully');
  } catch (installError) {
    console.error('Failed to install dependencies:', installError);
    process.exit(1);
  }
}

const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const AnonUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

// Apply plugins
puppeteerExtra.use(StealthPlugin());
puppeteerExtra.use(AnonUAPlugin());

// List of user agents to rotate through
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36'
];

// Helper function to get a random delay
const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to detect CAPTCHA
const detectCaptcha = async (page) => {
  const captchaDetected = await page.evaluate(() => {
    return (
      document.body.innerText.includes('captcha') ||
      document.body.innerText.includes('CAPTCHA') ||
      document.body.innerText.includes('unusual traffic') ||
      document.body.innerText.includes('verify you are human') ||
      document.querySelector('iframe[src*="recaptcha"]') !== null ||
      document.querySelector('div.g-recaptcha') !== null
    );
  });
  return captchaDetected;
};

async function scrape(searchQuery, maxRetries = 3) {
  console.error(`Scraping for query: ${searchQuery}`);
  
  let retries = 0;
  
  while (retries < maxRetries) {
    const url = `https://www.google.com/search?q=${searchQuery}`;
    console.error(`URL: ${url} (Attempt ${retries + 1}/${maxRetries})`);
    
    let browser;
    try {
      console.error('Launching browser...');
      browser = await puppeteerExtra.launch({
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-blink-features=AutomationControlled',
          `--window-size=${1024 + getRandomDelay(0, 100)},${768 + getRandomDelay(0, 100)}`,
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-infobars'
        ],
        ignoreHTTPSErrors: true
      });
      
      console.error('Creating new page...');
      const page = await browser.newPage();
      
      // Use a random user agent
      const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      console.error(`Setting user agent: ${userAgent}`);
      await page.setUserAgent(userAgent);

      // Set extra headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
      });
      
      // Spoof timezone and geolocation
      await page.evaluateOnNewDocument(() => {
        // Override timezone
        Object.defineProperty(Intl, 'DateTimeFormat', {
          get: function() {
            return function(locale, options) {
              if (options && options.timeZone) {
                options.timeZone = 'America/New_York';
              }
              return new Intl.DateTimeFormat(locale, options);
            };
          }
        });
        
        // Override navigator properties
        const overrides = {
          platform: 'Win32',
          languages: ['en-US', 'en'],
          webdriver: false
        };
        
        for (const key in overrides) {
          Object.defineProperty(navigator, key, { get: () => overrides[key] });
        }
        
        // Override WebGL fingerprinting
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 37445) {
            return 'Intel Inc.';
          }
          if (parameter === 37446) {
            return 'Intel Iris Pro Graphics';
          }
          return getParameter.apply(this, arguments);
        };
      });
      
      // Random delay before navigation (between 1-3 seconds)
      const preDelay = getRandomDelay(1000, 3000);
      console.error(`Waiting ${preDelay}ms before navigation...`);
      await new Promise(resolve => setTimeout(resolve, preDelay));
      
      // Set viewport with random size
      await page.setViewport({
        width: 1024 + getRandomDelay(0, 100),
        height: 768 + getRandomDelay(0, 100),
        deviceScaleFactor: 1
      });
      
      // Navigate with timeout and wait options
      console.error(`Navigating to ${url}...`);
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });
      
      // Random delay after navigation (between 2-4 seconds)
      const postDelay = getRandomDelay(2000, 4000);
      console.error(`Waiting ${postDelay}ms after navigation...`);
      await new Promise(resolve => setTimeout(resolve, postDelay));
      
      // Scroll the page randomly to appear more human-like
      console.error('Performing random scrolling...');
      await page.evaluate(() => {
        const totalHeight = document.body.scrollHeight;
        let scrolled = 0;
        const scrollStep = Math.floor(Math.random() * 100) + 100;
        
        const scrollInterval = setInterval(() => {
          window.scrollBy(0, scrollStep);
          scrolled += scrollStep;
          
          if (scrolled >= totalHeight * 0.7) {
            clearInterval(scrollInterval);
          }
        }, Math.floor(Math.random() * 100) + 100);
        
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
      
      // Check for CAPTCHA
      const hasCaptcha = await detectCaptcha(page);
      if (hasCaptcha) {
        console.error('CAPTCHA detected! Retrying with a different approach...');
        retries++;
        if (browser) await browser.close();
        
        // Wait longer between retries
        const retryDelay = getRandomDelay(5000, 10000);
        console.error(`Waiting ${retryDelay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      console.error('Taking screenshot...');
      const screenshotBuffer = await page.screenshot({ 
        fullPage: true,  // Changed to full page to capture more content
        encoding: 'binary'
      });
      
      const screenshot = screenshotBuffer.toString('base64');
      console.error(`Screenshot taken, size: ${screenshot.length}`);
      
      // We're now only interested in the screenshot, not the titles
      await browser.close();
      return {
        screenshot
      };
      
    } catch (error) {
      console.error(`Scraping error: ${error.message}`);
      retries++;
      if (browser) await browser.close();
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Wait between retries
      const retryDelay = getRandomDelay(3000, 7000);
      console.error(`Waiting ${retryDelay}ms before retry ${retries}...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw new Error('Failed to scrape after maximum retries');
}

// If script is called directly
if (require.main === module) {
  if (process.argv.length > 2) {
    const searchQuery = process.argv[2];
    console.error(`Starting scrape with query: ${searchQuery}`);
    
    scrape(searchQuery)
      .then(result => {
        console.error('Scraping completed successfully');
        console.log(JSON.stringify(result));
      })
      .catch(error => {
        console.error(`Scraping failed: ${error.message}`);
        process.exit(1);
      });
  } else {
    console.error('No search query provided');
    process.exit(1);
  }
}

module.exports = { scrape };
