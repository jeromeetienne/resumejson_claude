// npm imports
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Schema Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Prints the JSON Schema for a registered Zod schema. Skills call this to fetch
 * the exact contract to produce, so the shape lives in one place (the Zod schema)
 * and never drifts from what `SKILL.md` describes.
 */
export class SchemaCommand {
	/**
	 * Renders a Zod schema as a pretty-printed JSON Schema document.
	 *
	 * @param schema The Zod schema to convert.
	 * @param name The schema name, used as the JSON Schema title.
	 * @returns The JSON Schema as a formatted JSON string.
	 */
	static render(schema: z.ZodTypeAny, name: string): string {
		const jsonSchema = zodToJsonSchema(schema, { name, target: 'jsonSchema7' });
		return JSON.stringify(jsonSchema, null, 2);
	}
}
