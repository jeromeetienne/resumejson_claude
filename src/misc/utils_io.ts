// node imports
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Utils IO
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/** Sentinel path meaning stdin (for reads) or stdout (for writes). */
const STDIO_PATH = '-';

/**
 * File I/O helpers for the CLI, honoring `-` as stdin/stdout so commands can be
 * chained in a shell pipeline.
 */
export class UtilsIo {
	/**
	 * Reads UTF-8 text from a file, or from stdin when `path` is `-`.
	 *
	 * @param path The file path, or `-` for stdin.
	 * @returns The file contents.
	 */
	static readInput(path: string): string {
		if (path === STDIO_PATH) {
			return readFileSync(0, 'utf8');
		}
		return readFileSync(resolve(path), 'utf8');
	}

	/**
	 * Writes UTF-8 text to a file, or to stdout when `path` is `-` (appending a
	 * trailing newline for terminal readability).
	 *
	 * @param path The file path, or `-` for stdout.
	 * @param data The text to write.
	 */
	static writeOutput(path: string, data: string): void {
		if (path === STDIO_PATH) {
			process.stdout.write(data.endsWith('\n') === true ? data : `${data}\n`);
			return;
		}
		writeFileSync(resolve(path), data);
	}
}
