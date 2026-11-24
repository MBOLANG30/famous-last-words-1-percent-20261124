// Famous Last Words at 1 Percent — make.fun entry.
// Writes one original one-line farewell, spoken by a phone at 1% battery,
// to <output-dir>/entry.txt. Deterministic, no network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I survived three drops, one toilet, and his shower karaoke — but 1% is where I finally give up on him.";

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function validate(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error(`entry must be 1-199 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
}

function main(): void {
  validate(LINE);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  const roundTrip = readFileSync(target, "utf8");
  if (roundTrip !== LINE) {
    throw new Error("entry.txt round-trip mismatch");
  }
  validate(roundTrip);
}

main();
