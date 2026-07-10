// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ValidateCommand } from '../src/commands/validate_command.js';
import { SchemaRegistry } from '../src/misc/schema_registry.js';
import { JobPostingSchema, JobMatchSchema } from '../src/misc/job_schemas.js';
import { SAMPLE_JOB_POSTING, SAMPLE_JOB_MATCH } from './fixtures/sample_job.js';

describe('job schemas', () => {
	it('accept their valid fixtures', () => {
		for (const [schema, fixture] of [
			[JobPostingSchema, SAMPLE_JOB_POSTING],
			[JobMatchSchema, SAMPLE_JOB_MATCH],
		] as const) {
			const result = ValidateCommand.validate(JSON.stringify(fixture), schema);
			assert.equal(result.valid, true, result.errors.join('; '));
		}
	});

	it('accept a posting with null optional fields', () => {
		const remoteOnly = { ...SAMPLE_JOB_POSTING, location: null, employmentType: null, postedDate: null, salaryText: null };
		const result = ValidateCommand.validate(JSON.stringify(remoteOnly), JobPostingSchema);
		assert.equal(result.valid, true, result.errors.join('; '));
	});

	it('reject an unknown remote enum on a posting', () => {
		const wrong = { ...SAMPLE_JOB_POSTING, remote: 'anywhere' };
		const result = ValidateCommand.validate(JSON.stringify(wrong), JobPostingSchema);
		assert.equal(result.valid, false);
		assert.ok(result.errors.some((error) => error.startsWith('remote')));
	});

	it('reject an out-of-range fit and a bad verdict on a match', () => {
		const wrong = { ...SAMPLE_JOB_MATCH, overallFit: 150, verdict: 'perfect' };
		const result = ValidateCommand.validate(JSON.stringify(wrong), JobMatchSchema);
		assert.equal(result.valid, false);
		assert.ok(result.errors.some((error) => error.startsWith('overallFit')));
		assert.ok(result.errors.some((error) => error.startsWith('verdict')));
	});
});

describe('SchemaRegistry (job)', () => {
	it('registers the job schemas', () => {
		const names = SchemaRegistry.names();
		assert.equal(SchemaRegistry.has('job-posting'), true);
		assert.equal(SchemaRegistry.has('job-match'), true);
		assert.ok(names.includes('job-posting'));
		assert.ok(names.includes('job-match'));
		assert.deepEqual(names, [...names].sort()); // names() is sorted
	});
});
