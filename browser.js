const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  install,
  computeExecutablePath,
  detectBrowserPlatform,
  resolveBuildId,
  Browser,
} = require('@puppeteer/browsers');

const CACHE_DIR = path.join(os.homedir(), '.cache', 'puppeteer');

// Environments that already ship a browser (e.g. Playwright's) expose it here.
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';

// Returns a usable Chrome/Chromium executable path, preferring a browser
// that's already on disk and only downloading one via @puppeteer/browsers
// when nothing local is available (some sandboxes block that download).
async function ensureBrowser() {
  if (fs.existsSync(PREINSTALLED_CHROMIUM)) {
    return PREINSTALLED_CHROMIUM;
  }

  const platform = detectBrowserPlatform();
  if (!platform) {
    throw new Error('Could not detect platform for browser download');
  }

  const buildId = await resolveBuildId(Browser.CHROME, platform, 'stable');

  const executablePath = computeExecutablePath({
    cacheDir: CACHE_DIR,
    browser: Browser.CHROME,
    buildId,
    platform,
  });

  await install({
    cacheDir: CACHE_DIR,
    browser: Browser.CHROME,
    buildId,
    platform,
  });

  return executablePath;
}

module.exports = { ensureBrowser };
