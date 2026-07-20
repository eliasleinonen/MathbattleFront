import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

const artifactDir = '/Users/eliasleinonen/.gemini/antigravity/brain/20b99e77-ab1e-4390-860f-65d64a77aa15';

async function main() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    cwd: '/Users/eliasleinonen/Koodaus/MathbattleFront/frontend',
    stdio: 'pipe'
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://127.0.0.1:4173/daily-challenge', { waitUntil: 'networkidle0' });
  await new Promise(res => setTimeout(res, 500));
  await page.screenshot({ path: path.join(artifactDir, 'daily_challenge_fixed.png'), fullPage: false });

  await browser.close();
  server.kill();
  console.log('Saved screenshot!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
