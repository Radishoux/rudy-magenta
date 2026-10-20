import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "public");
const html = await Bun.file(resolve(root, "index.html")).text();
const css = await Bun.file(resolve(root, "styles.css")).text();
const js = await Bun.file(resolve(root, "app.js")).text();
const failures: string[] = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) failures.push(`Missing anchor: ${match[1]}`);
}
for (const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
  if (!await Bun.file(resolve(root, match[1])).exists()) failures.push(`Missing local asset: ${match[1]}`);
}
if (ids.length !== new Set(ids).size) failures.push("Duplicate HTML IDs");
if (html.includes("<iframe")) failures.push("YouTube must load only after a click");
if (!css.includes("prefers-reduced-motion")) failures.push("Missing reduced-motion handling");
if (!html.includes('lang="fr"')) failures.push("Missing French page language");
if (/[—–]/.test(html)) failures.push("Unexpected em/en dash in public copy");
if (!js.includes("youtube-nocookie.com/embed/QyZS4qw0xKk")) failures.push("Wrong video identifier");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Static checks passed: anchors, asset paths, IDs, language, click-to-load video, reduced motion.");
