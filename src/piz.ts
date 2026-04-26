#! /usr/bin/env bun

import path from "path";

const generateFill = (size: number) => {
  const newSize = size * 2;
  const bytes = crypto.getRandomValues(new Uint8Array(newSize));
  return Buffer.from(bytes).toString("base64");
};

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
piz — pack a file into a .piz archive with random padding

Usage:
  piz <file>         Pack <file> into <file>.piz
  piz --help, -h     Show this help message

Example:
  piz secret.txt     Creates secret.txt.piz
`);
  process.exit(0);
}

const [name] = args;

if (!name) {
  console.error("Error: please provide a file name.");
  console.error("Run 'piz --help' for usage.");
  process.exit(1);
}

console.log(`pizzing file... ${name}`);
const dir = path.dirname(name);
const filename = path.basename(name);

const originalFile = Bun.file(name);

console.log(`original file size: ${originalFile.size}`);

const content = generateFill(originalFile.size);

const archive = new Bun.Archive({
  ".fill.txt": content,
  [filename]: await originalFile.arrayBuffer(),
});

const saveLocation = path.join(dir, `${filename}.piz`);
const resultingSize = await Bun.write(saveLocation, archive);

console.log(`resulting size: ${resultingSize}`);
