// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ValidateCommand } from '../src/commands/validate_command.js';
import { ResumeJsonSchema } from '../src/misc/resume_schemas.js';
import { SAMPLE_RESUME } from './fixtures/sample_resume.js';

describe('ValidateCommand.validate', () => {
	it('accepts a complete canonical resume', () => {
		const result = ValidateCommand.validate(JSON.stringify(SAMPLE_RESUME), ResumeJsonSchema);
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
	});

	it('accepts a resume that omits an optional section and normalizes it to null', () => {
		const incomplete: Record<string, unknown> = { ...SAMPLE_RESUME };
		delete incomplete.certificates;
		const result = ValidateCommand.validate(JSON.stringify(incomplete), ResumeJsonSchema);
		assert.equal(result.valid, true);
		// parse fills the missing section with null (canonical shape for downstream)
		const parsed = ResumeJsonSchema.parse(incomplete);
		assert.equal(parsed.certificates, null);
	});

	it('rejects a wrong-typed field with a pathed message', () => {
		const wrong = { ...SAMPLE_RESUME, basics: { ...SAMPLE_RESUME.basics, name: 42 } };
		const result = ValidateCommand.validate(JSON.stringify(wrong), ResumeJsonSchema);
		assert.equal(result.valid, false);
		assert.ok(result.errors.some((error) => error.startsWith('basics.name')));
	});

	it('reports malformed JSON rather than throwing', () => {
		const result = ValidateCommand.validate('{ not json', ResumeJsonSchema);
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.ok(result.errors[0].startsWith('invalid JSON'));
	});
});
