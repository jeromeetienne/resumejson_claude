// npm imports
import { z } from 'zod';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Validate Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/** Outcome of a validation: whether it passed, plus human-readable error lines. */
export type ValidateResult = {
	valid: boolean;
	errors: string[];
};

/**
 * Validates JSON text against a Zod schema. This is the schema gate a skill runs
 * after each AI step: the agent writes JSON, `validate` checks it, and the agent
 * self-corrects from the reported errors until it passes.
 */
export class ValidateCommand {
	/**
	 * Parses `jsonText` and validates it against `schema`.
	 *
	 * @param jsonText The raw JSON document text.
	 * @param schema The Zod schema to validate against.
	 * @returns `{ valid: true, errors: [] }` on success, or `{ valid: false, errors }`
	 *          with one line per JSON-parse or schema violation.
	 */
	static validate(jsonText: string, schema: z.ZodTypeAny): ValidateResult {
		let data: unknown;
		try {
			data = JSON.parse(jsonText);
		} catch (error: unknown) {
			return { valid: false, errors: [ValidateCommand.jsonErrorMessage(error)] };
		}

		const parsed = schema.safeParse(data);
		if (parsed.success === true) {
			return { valid: true, errors: [] };
		}
		return { valid: false, errors: ValidateCommand.formatIssues(parsed.error) };
	}

	/**
	 * Parses and validates `jsonText`, returning the typed value or throwing an
	 * Error whose message lists the problems the same way {@link validate} reports
	 * them — so `to_markdown` / `to_pdf` fail as legibly as `validate`.
	 *
	 * @param jsonText The raw JSON document text.
	 * @param schema The Zod schema to validate against.
	 * @param label A short name for the document, used in the error message.
	 * @returns The parsed, schema-conforming value.
	 * @throws If the text is not valid JSON or does not conform to `schema`.
	 */
	static parse<S extends z.ZodTypeAny>(jsonText: string, schema: S, label = 'input'): z.infer<S> {
		let data: unknown;
		try {
			data = JSON.parse(jsonText);
		} catch (error: unknown) {
			throw new Error(ValidateCommand.jsonErrorMessage(error));
		}

		const parsed = schema.safeParse(data);
		if (parsed.success === true) {
			return parsed.data;
		}
		const errors = ValidateCommand.formatIssues(parsed.error);
		throw new Error(`${label} does not match schema:\n  - ${errors.join('\n  - ')}`);
	}

	/**
	 * Formats Zod issues as `path: message` lines.
	 *
	 * @param error The Zod error to format.
	 * @returns One line per issue.
	 */
	private static formatIssues(error: z.ZodError): string[] {
		return error.issues.map((issue) => {
			const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
			return `${path}: ${issue.message}`;
		});
	}

	/**
	 * Renders a JSON-parse failure as a single message line.
	 *
	 * @param error The thrown parse error.
	 * @returns The `invalid JSON: …` message.
	 */
	private static jsonErrorMessage(error: unknown): string {
		const message = error instanceof Error ? error.message : String(error);
		return `invalid JSON: ${message}`;
	}
}
