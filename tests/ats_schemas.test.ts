// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ValidateCommand } from '../src/commands/validate_command.js';
import { SchemaRegistry } from '../src/misc/schema_registry.js';
import { AtsScoreSchema, AtsReviewSchema, AtsQuestionSchema } from '../src/misc/ats_schemas.js';
import { SAMPLE_ATS_SCORE, SAMPLE_ATS_REVIEW, SAMPLE_ATS_QUESTION } from './fixtures/sample_ats.js';

describe('ATS schemas', () => {
	it('accept their valid fixtures', () => {
		for (const [schema, fixture] of [
			[AtsScoreSchema, SAMPLE_ATS_SCORE],
			[AtsReviewSchema, SAMPLE_ATS_REVIEW],
			[AtsQuestionSchema, SAMPLE_ATS_QUESTION],
		] as const) {
			const result = ValidateCommand.validate(JSON.stringify(fixture), schema);
			assert.equal(result.valid, true, result.errors.join('; '));
		}
	});

	it('reject an out-of-range score', () => {
		const wrong = { ...SAMPLE_ATS_SCORE, overallScore: 150 };
		const result = ValidateCommand.validate(JSON.stringify(wrong), AtsScoreSchema);
		assert.equal(result.valid, false);
		assert.ok(result.errors.some((error) => error.startsWith('overallScore')));
	});

	it('reject an unknown enum value', () => {
		const wrong = { ...SAMPLE_ATS_REVIEW, complianceLevel: 'perfect' };
		const result = ValidateCommand.validate(JSON.stringify(wrong), AtsReviewSchema);
		assert.equal(result.valid, false);
		assert.ok(result.errors.some((error) => error.startsWith('complianceLevel')));
	});
});

describe('SchemaRegistry (ats)', () => {
	it('registers every ATS schema name', () => {
		const names = SchemaRegistry.names();
		for (const name of ['ats-score', 'ats-review', 'ats-question']) {
			assert.equal(SchemaRegistry.has(name), true);
			assert.ok(names.includes(name));
		}
		assert.deepEqual(names, [...names].sort()); // names() is sorted
	});
});
