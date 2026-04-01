import { cp, mkdir, readdir, rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "");
const dist = path.join(root, "dist");
const allowedDirs = new Set(["assets", "app"]);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });

for (const entry of entries) {
  if (entry.name === "dist" || entry.name === "node_modules" || entry.name === "scripts") {
    continue;
  }

  if (entry.isDirectory() && allowedDirs.has(entry.name)) {
    await cp(path.join(root, entry.name), path.join(dist, entry.name), {
      recursive: true,
      force: true,
    });
    continue;
  }

  if (entry.isFile() && entry.name.endsWith(".html")) {
    await cp(path.join(root, entry.name), path.join(dist, entry.name));
  }
}

console.log("Build complete. dist/ contains the static site ready to deploy.");
