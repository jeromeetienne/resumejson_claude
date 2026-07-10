// npm imports
import { z } from 'zod';

// local imports
import { ResumeJsonSchema } from './resume_schemas.js';
import { AtsScoreSchema, AtsReviewSchema, AtsQuestionSchema } from './ats_schemas.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Schema Registry
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Named Zod schemas the `validate` and `schema` commands operate on. This is the
 * single source of truth for the contracts a skill produces; later phases add
 * the `ats-*` schemas here.
 */
export class SchemaRegistry {
	private static readonly schemas: Record<string, z.ZodTypeAny> = {
		'resume': ResumeJsonSchema,
		'ats-score': AtsScoreSchema,
		'ats-review': AtsReviewSchema,
		'ats-question': AtsQuestionSchema,
	};

	/**
	 * Returns the sorted list of registered schema names.
	 *
	 * @returns The known schema names.
	 */
	static names(): string[] {
		return Object.keys(SchemaRegistry.schemas).sort();
	}

	/**
	 * Reports whether a schema name is registered.
	 *
	 * @param name The schema name to test.
	 * @returns True when the name is known.
	 */
	static has(name: string): boolean {
		return Object.prototype.hasOwnProperty.call(SchemaRegistry.schemas, name);
	}

	/**
	 * Resolves a schema name to its Zod schema.
	 *
	 * @param name The schema name to resolve.
	 * @returns The matching Zod schema.
	 * @throws If `name` is not registered.
	 */
	static get(name: string): z.ZodTypeAny {
		const schema = SchemaRegistry.schemas[name];
		if (schema === undefined) {
			throw new Error(`unknown schema '${name}', expected one of: ${SchemaRegistry.names().join(', ')}`);
		}
		return schema;
	}
}
