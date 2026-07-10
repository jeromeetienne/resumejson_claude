// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { SchemaRegistry } from '../src/misc/schema_registry.js';
import { SchemaCommand } from '../src/commands/schema_command.js';
import { ResumeJsonSchema } from '../src/misc/resume_schemas.js';

describe('SchemaRegistry', () => {
	it('knows the resume schema', () => {
		assert.equal(SchemaRegistry.has('resume'), true);
		assert.ok(SchemaRegistry.names().includes('resume'));
		assert.equal(SchemaRegistry.get('resume'), ResumeJsonSchema);
	});

	it('throws on an unknown schema name, listing the known ones', () => {
		assert.throws(() => SchemaRegistry.get('nope'), /unknown schema 'nope'.*resume/);
	});
});

describe('SchemaCommand.render', () => {
	it('emits a JSON Schema object with the resume properties', () => {
		const jsonSchema = JSON.parse(SchemaCommand.render(ResumeJsonSchema, 'resume')) as Record<string, unknown>;
		const serialized = JSON.stringify(jsonSchema);
		assert.ok(serialized.includes('basics'));
		assert.ok(serialized.includes('work'));
		assert.ok(serialized.includes('certificates'));
	});
});
