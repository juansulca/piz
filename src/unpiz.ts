#! /usr/bin/env bun

import path from "path";
const [name] = process.argv.slice(2);

console.log(`unpizzing file... ${name}`);

if (!name) {
  console.log("Please provide a file name.");
  process.exit(1);
}

const dir = path.dirname(name);
const filename = path.basename(name);
const tar = Bun.file(name);
console.log(tar.size);

const archive = new Bun.Archive(await tar.bytes());
const files = await archive.files();

for (const [pth, file] of files) {
  if (!pth.includes(".fill.txt")) {
    const name = path.basename(pth);
    const saveLocation = path.join(dir, name);
    console.log(`writing ${saveLocation}`);
    await Bun.write(saveLocation, file);
  }
}
