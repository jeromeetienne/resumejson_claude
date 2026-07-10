#!/usr/bin/env node
// node imports
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// npm imports
import { Command } from 'commander';
import Chalk from 'chalk';

// local imports
import { PROJECT_ROOT } from './misc/project_root.js';
import { SchemaRegistry } from './misc/schema_registry.js';
import { UtilsIo } from './misc/utils_io.js';
import { ValidateCommand } from './commands/validate_command.js';
import { SchemaCommand } from './commands/schema_command.js';
import { ToMarkdownCommand } from './commands/to_markdown_command.js';
import { ToPdfCommand } from './commands/to_pdf_command.js';
import { InstallCommand, type InstallMode } from './commands/install_command.js';

/** Wire up the subcommands and run them. */
async function main(): Promise<void> {
	const packageJson = JSON.parse(readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf8')) as { version: string };

	const program = new Command();
	program
		.name('resumejson_claude')
		.description('Deterministic toolbelt for the resume-convert / resume-ats Claude skills')
		.version(packageJson.version, '-V, --version', 'output the version number');

	program
		.command('validate')
		.description('Validate a JSON document against a named schema (Zod); exits non-zero on failure')
		.requiredOption('-i, --input <file>', 'input JSON file (or - for stdin)')
		.option('-s, --schema <name>', `schema name (${SchemaRegistry.names().join(', ')})`, 'resume')
		.action((options: { input: string; schema: string }) => {
			const schema = SchemaRegistry.get(options.schema);
			const jsonText = UtilsIo.readInput(options.input);
			const result = ValidateCommand.validate(jsonText, schema);
			if (result.valid === true) {
				console.log(Chalk.green(`✓ valid against '${options.schema}'`));
				return;
			}
			console.error(Chalk.red(`✗ invalid against '${options.schema}' (${result.errors.length} problem(s)):`));
			for (const error of result.errors) {
				console.error(Chalk.red(`  - ${error}`));
			}
			process.exit(1);
		});

	program
		.command('schema')
		.description('Print the JSON Schema for a named schema (the contract a skill produces)')
		.argument('<name>', `schema name (${SchemaRegistry.names().join(', ')})`)
		.action((name: string) => {
			const schema = SchemaRegistry.get(name);
			console.log(SchemaCommand.render(schema, name));
		});

	program
		.command('to_markdown')
		.description('Render a ResumeJson document to Markdown (deterministic)')
		.requiredOption('-i, --input <file>', 'input ResumeJson file (or - for stdin)')
		.option('-o, --output <file>', 'output Markdown file (or - for stdout)', '-')
		.action((options: { input: string; output: string }) => {
			const jsonText = UtilsIo.readInput(options.input);
			const markdown = ToMarkdownCommand.render(jsonText);
			UtilsIo.writeOutput(options.output, markdown);
		});

	program
		.command('to_pdf')
		.description('Render a ResumeJson document to a PDF (Mustache template + headless Chrome)')
		.requiredOption('-i, --input <file>', 'input ResumeJson file (or - for stdin)')
		.requiredOption('-o, --output <file>', 'output PDF file')
		.option('-t, --template <file>', 'Mustache HTML template', ToPdfCommand.defaultTemplatePath())
		.action(async (options: { input: string; output: string; template: string }) => {
			const jsonText = UtilsIo.readInput(options.input);
			const template = readFileSync(resolve(options.template), 'utf8');
			const pdf = await ToPdfCommand.render(jsonText, template);
			writeFileSync(resolve(options.output), pdf);
			console.log(Chalk.green(`✓ wrote ${options.output}`));
		});

	program
		.command('install')
		.description('Mirror the bundled resume skills into a target .claude directory')
		.argument('[target]', 'destination .claude directory', '.claude')
		.option('-m, --mode <mode>', 'copy | symlink', 'copy')
		.option('-f, --format <format>', 'markdown | json', 'markdown')
		.action((target: string, options: { mode: string; format: string }) => {
			const mode = requireMode(options.mode);
			const result = InstallCommand.install(target, mode);
			console.log(InstallCommand.formatInstall(result, options.format));
		});

	program
		.command('uninstall')
		.description('Remove the bundled resume skills from a target .claude directory')
		.argument('[target]', 'destination .claude directory', '.claude')
		.option('-f, --format <format>', 'markdown | json', 'markdown')
		.action((target: string, options: { format: string }) => {
			const result = InstallCommand.uninstall(target);
			console.log(InstallCommand.formatUninstall(result, options.format));
		});

	await program.parseAsync(process.argv);
}

/**
 * Narrows a raw `--mode` string to an {@link InstallMode}.
 *
 * @param mode The mode flag value.
 * @returns The validated mode.
 * @throws If `mode` is neither `copy` nor `symlink`.
 */
function requireMode(mode: string): InstallMode {
	if (mode !== 'copy' && mode !== 'symlink') {
		throw new Error(`unknown mode '${mode}', expected 'copy' or 'symlink'`);
	}
	return mode;
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(Chalk.red(`error: ${message}`));
	process.exit(1);
});
