import { cp, mkdir, realpath, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dir, "..");
const output = resolve(root, "dist");
const resolvedRoot = await realpath(root);
const resolvedOutput = await realpath(output).catch(() => output);
if (resolvedOutput !== resolve(resolvedRoot, "dist") || !resolvedOutput.startsWith(resolvedRoot + sep)) {
  throw new Error("Refusing to clean a dist directory outside the project.");
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Only this public allowlist is deployable. Private planning and project docs stay out.
for (const file of ["index.html", "styles.css", "app.js", "assets", ".nojekyll"]) {
  await cp(resolve(root, "public", file), resolve(output, file), { recursive: true });
}
console.log(`Static site built: ${output}`);
