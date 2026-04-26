#! /usr/bin/env bun

import path from "path";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
unpiz — extract the original file from a .piz archive

Usage:
  unpiz <file.piz>   Extract the original file from <file.piz>
  unpiz --help, -h   Show this help message

Example:
  unpiz secret.txt.piz     Extracts secret.txt
`);
  process.exit(0);
}

const [name] = args;

if (!name) {
  console.error("Error: please provide a .piz file.");
  console.error("Run 'unpiz --help' for usage.");
  process.exit(1);
}

console.log(`unpizzing file... ${name}`);

const dir = path.dirname(name);
const filename = path.basename(name);
const tar = Bun.file(name);
console.log(`Piz size: ${tar.size}`);

const archive = new Bun.Archive(await tar.bytes());
const files = await archive.files();

for (const [pth, file] of files) {
  if (!pth.includes(".fill.txt")) {
    const name = path.basename(pth);
    const saveLocation = path.join(dir, name);
    console.log(`Unpiz size: ${file.size}`);
    console.log(`writing ${saveLocation}`);
    await Bun.write(saveLocation, file);
  }
}
