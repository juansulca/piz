import path from "path";

const generateFill = (size: number) => {
  const newSize = size * 2;
  const bytes = crypto.getRandomValues(new Uint8Array(newSize));
  return Buffer.from(bytes).toString("base64");
};

const [name] = process.argv.slice(2);

if (!name) {
  console.log("Please provide a file name.");
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

const saveLocation = path.join(dir, "bundle.piz");
await Bun.write(saveLocation, archive);
