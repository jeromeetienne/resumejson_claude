// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, lstatSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// local imports
import { InstallCommand } from '../src/commands/install_command.js';

const SKILL_REL = join('skills', 'resume-convert', 'SKILL.md');

/**
 * Creates a temp dir with symlinks resolved. On macOS `os.tmpdir()` sits under
 * `/var` (a symlink to `/private/var`), which would break the relative symlinks
 * `install --mode symlink` writes; real `.claude` targets share the repo's tree.
 */
function makeTempDir(): string {
	return realpathSync(mkdtempSync(join(tmpdir(), 'resumejson-')));
}

describe('InstallCommand', () => {
	it('copies the bundled skills into a target, then uninstalls them', () => {
		const dir = makeTempDir();
		try {
			const installed = InstallCommand.install(dir, 'copy');
			assert.equal(installed.mode, 'copy');
			assert.ok(installed.claude.installed.includes(SKILL_REL));
			assert.equal(existsSync(join(dir, SKILL_REL)), true);
			assert.equal(lstatSync(join(dir, SKILL_REL)).isFile(), true);

			const removed = InstallCommand.uninstall(dir);
			assert.deepEqual(removed.removed.sort(), installed.claude.installed.sort());
			assert.equal(existsSync(join(dir, SKILL_REL)), false);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('symlinks the bundled skills back to the source', () => {
		const dir = makeTempDir();
		try {
			const installed = InstallCommand.install(dir, 'symlink');
			assert.equal(installed.mode, 'symlink');
			const target = join(dir, SKILL_REL);
			assert.equal(lstatSync(target).isSymbolicLink(), true);
			assert.equal(existsSync(target), true);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('renders a json install summary', () => {
		const dir = makeTempDir();
		try {
			const result = InstallCommand.install(dir, 'copy');
			const parsed = JSON.parse(InstallCommand.formatInstall(result, 'json')) as { mode: string };
			assert.equal(parsed.mode, 'copy');
			assert.throws(() => InstallCommand.formatInstall(result, 'yaml'));
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
