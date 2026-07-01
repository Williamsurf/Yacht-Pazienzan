import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const [,, url = 'http://localhost:3000', label] = process.argv;

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Find next available N so we never overwrite
let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`))) n++;
const outPath = path.join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.waitForTimeout(800); // allow fonts and animations to settle
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
