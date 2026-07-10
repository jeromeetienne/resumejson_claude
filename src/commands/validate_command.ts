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
			const message = error instanceof Error ? error.message : String(error);
			return { valid: false, errors: [`invalid JSON: ${message}`] };
		}

		const parsed = schema.safeParse(data);
		if (parsed.success === true) {
			return { valid: true, errors: [] };
		}

		const errors = parsed.error.issues.map((issue) => {
			const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
			return `${path}: ${issue.message}`;
		});
		return { valid: false, errors };
	}
}
