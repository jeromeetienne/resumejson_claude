// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ResumeMarkdown } from '../src/misc/resume_markdown.js';
import { ToMarkdownCommand } from '../src/commands/to_markdown_command.js';
import { SAMPLE_RESUME } from './fixtures/sample_resume.js';

describe('ResumeMarkdown.render', () => {
	const markdown = ResumeMarkdown.render(SAMPLE_RESUME);

	it('renders the person and section headers', () => {
		assert.ok(markdown.includes('## Ada Lovelace'));
		assert.ok(markdown.includes('## Work Experience'));
		assert.ok(markdown.includes('## Education'));
		assert.ok(markdown.includes('## Skills'));
	});

	it('renders work entries with position, company, and date range', () => {
		assert.ok(markdown.includes('### Programmer @ Analytical Engine Project *(1842-01-01 — 1843-01-01)*'));
	});

	it('omits empty sections', () => {
		assert.ok(markdown.includes('## Awards') === false);
		assert.ok(markdown.includes('## Projects') === false);
	});
});

describe('ToMarkdownCommand.render', () => {
	it('validates then renders from JSON text', () => {
		const markdown = ToMarkdownCommand.render(JSON.stringify(SAMPLE_RESUME));
		assert.ok(markdown.startsWith('# Resume'));
		assert.ok(markdown.includes('Ada Lovelace'));
	});

	it('throws on a resume with a wrong-typed field', () => {
		const wrong = { ...SAMPLE_RESUME, basics: { ...SAMPLE_RESUME.basics, name: 42 } };
		assert.throws(() => ToMarkdownCommand.render(JSON.stringify(wrong)));
	});
});
