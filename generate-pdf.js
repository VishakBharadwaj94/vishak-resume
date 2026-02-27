// Generates Vishak_Bharadwaj_Resume.pdf as a single page sized to content.
// Uses puppeteer-core + system Chrome — no Chromium download needed.
const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  // 210mm at 96dpi ≈ 794px — match the .page width in the CSS
  await page.setViewport({ width: 794, height: 1123 });

  const src = `file://${path.resolve(__dirname, 'resume-print.html')}`;
  await page.goto(src, { waitUntil: 'networkidle0' });

  // Emulate print media so the measurement matches what the PDF renderer sees
  await page.emulateMediaType('print');

  // Measure the rendered height of the content in print-layout mode
  const heightPx = await page.evaluate(
    () => document.querySelector('.page').scrollHeight
  );

  // Convert px → mm (96dpi) and inject an exact @page size so Chrome never
  // paginates the content and the PDF has no trailing blank space.
  const heightMm = Math.ceil(heightPx * 25.4 / 96) + 2;
  await page.addStyleTag({
    content: `@page { size: 210mm ${heightMm}mm !important; margin: 0; }`,
  });

  await page.pdf({
    path: path.resolve(__dirname, 'Vishak_Bharadwaj_Resume.pdf'),
    width: '210mm',
    height: `${heightMm}mm`,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log(`PDF generated — single page, ${heightPx}px (${heightMm}mm) tall.`);
})();
