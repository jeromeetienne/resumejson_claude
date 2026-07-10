// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// local imports
import { ResumeHtml } from '../src/misc/resume_html.js';
import { ToPdfCommand } from '../src/commands/to_pdf_command.js';
import { SAMPLE_RESUME } from './fixtures/sample_resume.js';

const TEMPLATE = readFileSync(ToPdfCommand.defaultTemplatePath(), 'utf8');

describe('ResumeHtml.render', () => {
	it('fills the Mustache template with resume content', () => {
		const html = ResumeHtml.render(SAMPLE_RESUME, TEMPLATE);
		assert.ok(html.includes('<!doctype html>'));
		assert.ok(html.includes('Ada Lovelace'));
		assert.ok(html.includes('Analytical Engine Project'));
	});

	it('omits falsy sections (empty arrays / null)', () => {
		const html = ResumeHtml.render(SAMPLE_RESUME, TEMPLATE);
		// no work highlights beyond the one present; awards section is empty in the fixture
		assert.equal(html.includes('{{'), false); // no unrendered tags left
	});
});

describe('ToPdfCommand.renderHtml', () => {
	it('validates before rendering (throws on a wrong-typed field)', () => {
		const wrong = { ...SAMPLE_RESUME, basics: { ...SAMPLE_RESUME.basics, name: 42 } };
		assert.throws(() => ToPdfCommand.renderHtml(JSON.stringify(wrong), TEMPLATE));
	});
});
