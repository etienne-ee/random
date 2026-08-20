const puppeteer = require('puppeteer-core');
const { ensureBrowser } = require('./browser');

async function main() {
  const executablePath = await ensureBrowser();
  const args = ['--no-sandbox'];
  if (process.env.HTTPS_PROXY) {
    args.push(`--proxy-server=${process.env.HTTPS_PROXY}`);
  }

  const browser = await puppeteer.launch({ executablePath, args });

  const page = await browser.newPage();
  await page.setContent('<title>puppeteer-core works</title><h1>hello</h1>');
  console.log(await page.title());

  await browser.close();
}

main();
