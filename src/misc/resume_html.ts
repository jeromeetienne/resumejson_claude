// npm imports
import Mustache from 'mustache';

// local imports
import type { ResumeJson } from './resume_schemas.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumeHtml — deterministic ResumeJson -> HTML via a Mustache template.
//	Ported from resumejson_cli (ResumeMarkdown.toHtml).
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ResumeHtml {
	/**
	 * Renders a {@link ResumeJson} into HTML using a Mustache template. Mustache
	 * treats `null`, `false`, and empty arrays as falsy, so the template's
	 * `{{#section}}` blocks naturally skip absent data.
	 *
	 * @param resumeJson The resume to render.
	 * @param template The Mustache HTML template source.
	 * @returns The rendered HTML.
	 */
	static render(resumeJson: ResumeJson, template: string): string {
		return Mustache.render(template, resumeJson);
	}
}
