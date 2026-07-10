// npm imports
import Puppeteer from 'puppeteer';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Utils PDF
//	Ported from resumejson_cli (UtilsPdf.html2pdf).
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class UtilsPdf {
	/**
	 * Renders an HTML string to a PDF buffer using headless Chrome (Puppeteer),
	 * A4 with background graphics.
	 *
	 * @param renderedHtml The HTML document to print.
	 * @returns The generated PDF as a Buffer.
	 */
	static async html2pdf(renderedHtml: string): Promise<Buffer> {
		const browser = await Puppeteer.launch({
			args: [
				'--allow-file-access-from-files',
				'--enable-local-file-accesses',
				'--no-sandbox',
				'--disable-setuid-sandbox',
			],
		});
		try {
			const page = await browser.newPage();
			await page.setContent(renderedHtml, { waitUntil: 'load' });
			await page.emulateMediaType('screen');
			const resumePdf = await page.pdf({
				format: 'A4',
				printBackground: true,
				scale: 1.0,
				preferCSSPageSize: true,
			});
			return Buffer.from(resumePdf);
		} finally {
			await browser.close();
		}
	}
}
