// node capture.js  →  writes work/*.webp  (needs: npm i playwright sharp && npx playwright install chromium)
const { chromium } = require('playwright'); const sharp = require('sharp'); const fs = require('fs');
const sites = {
  bearriver:  { url: 'https://bearriverconstruction.com', w: 1600, h: 1000 },
  brypto:     { url: 'https://joinbrypto.com',            w: 2000, h: 860  },
  strawberry: { url: 'https://strawberrystreetevents.com', w: 1600, h: 1000 },
  ghoul:      { url: 'https://ghoulpoker.com',            w: 1920, h: 1080, mobile: false },
};
(async () => {
  fs.mkdirSync('work', { recursive: true });
  const b = await chromium.launch();
  for (const [k, s] of Object.entries(sites)) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
    await p.goto(s.url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
    const png = await p.screenshot(); await sharp(png).webp({ quality: 82 }).toFile(`work/${k}.webp`);
    if (s.mobile !== false) {
      const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
      await m.goto(s.url, { waitUntil: 'networkidle' }); await m.waitForTimeout(2000);
      await sharp(await m.screenshot()).webp({ quality: 82 }).toFile(`work/${k}-m.webp`);
    }
    console.log('ok', k);
  }
  await b.close();
})();
