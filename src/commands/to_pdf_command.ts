// node imports
import { resolve } from 'node:path';

// local imports
import { PROJECT_ROOT } from '../misc/project_root.js';
import { ResumeJsonSchema } from '../misc/resume_schemas.js';
import { ResumeHtml } from '../misc/resume_html.js';
import { UtilsPdf } from '../misc/utils_pdf.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	To PDF Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/** The bundled default Mustache template shipped in `assets/`. */
const DEFAULT_TEMPLATE_PATH = resolve(PROJECT_ROOT, 'assets', 'resumejson_template.mustache.html');

/**
 * Deterministic `ResumeJson` -> PDF conversion: validate, render HTML via a
 * Mustache template, then print to PDF with headless Chrome.
 */
export class ToPdfCommand {
	/**
	 * @returns The absolute path to the bundled default template.
	 */
	static defaultTemplatePath(): string {
		return DEFAULT_TEMPLATE_PATH;
	}

	/**
	 * Parses and validates a resume, then renders it to HTML (no browser needed).
	 *
	 * @param jsonText The raw `ResumeJson` document text.
	 * @param template The Mustache HTML template source.
	 * @returns The rendered HTML.
	 * @throws If the text is not valid JSON or does not conform to {@link ResumeJsonSchema}.
	 */
	static renderHtml(jsonText: string, template: string): string {
		const resumeJson = ResumeJsonSchema.parse(JSON.parse(jsonText));
		return ResumeHtml.render(resumeJson, template);
	}

	/**
	 * Renders a resume to a PDF buffer.
	 *
	 * @param jsonText The raw `ResumeJson` document text.
	 * @param template The Mustache HTML template source.
	 * @returns The generated PDF as a Buffer.
	 */
	static async render(jsonText: string, template: string): Promise<Buffer> {
		return UtilsPdf.html2pdf(ToPdfCommand.renderHtml(jsonText, template));
	}
}
