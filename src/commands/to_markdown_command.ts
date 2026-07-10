// local imports
import { ResumeJsonSchema } from '../misc/resume_schemas.js';
import { ResumeMarkdown } from '../misc/resume_markdown.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	To Markdown Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Deterministic `ResumeJson` -> Markdown conversion. Validates the input against
 * {@link ResumeJsonSchema} before rendering so malformed resumes fail loudly
 * rather than producing garbage.
 */
export class ToMarkdownCommand {
	/**
	 * Parses, validates, and renders a resume JSON document to Markdown.
	 *
	 * @param jsonText The raw `ResumeJson` document text.
	 * @returns The rendered Markdown.
	 * @throws If the text is not valid JSON or does not conform to {@link ResumeJsonSchema}.
	 */
	static render(jsonText: string): string {
		const data: unknown = JSON.parse(jsonText);
		const resumeJson = ResumeJsonSchema.parse(data);
		return ResumeMarkdown.render(resumeJson);
	}
}
