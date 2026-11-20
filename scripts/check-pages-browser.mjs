import { chromium } from 'playwright';
const base = 'https://sunup00-hys.github.io/neon-slide-family';
const browser = await chromium.launch({ headless: true });
let failed = false;
try {
  for (const path of ['/', '/stairs-preview.html']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    const title = await page.title();
    console.log(path, 'HTTP', response?.status(), 'title', title);
    if (!response?.ok()) { console.error('HTTP failure', path); failed = true; }
    if (errors.length) { console.error('Runtime errors', path, errors); failed = true; }
    if (path.includes('stairs')) {
      for (const id of ['duelDialog', 'duelClose', 'familyProfileDialog', 'familyProfileClose']) {
        if (await page.locator('#' + id).count() !== 1) { console.error('Missing/duplicate', id); failed = true; }
      }
      const duelEntry = page.locator('#duelEntry');
      if (await duelEntry.count() !== 1) { console.error('Missing duel entry'); failed = true; }
      else {
        await duelEntry.click({ timeout: 10000 });
        const open = await page.locator('#duelDialog').evaluate(el => el.open);
        if (!open) { console.error('Duel dialog did not open'); failed = true; }
        else {
          await page.locator('#duelClose').click();
          console.log('Duel dialog close click attempted');
        }
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
