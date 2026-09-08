#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import ts from "typescript";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");
const sourceRoots = ["app", "components", "context", "lib"];
const outputDir = join(root, "i18n", "ui-messages");
const targets = ["en", "de", "es", "fr", "it", "pt", "ja", "zh-CN", "zh-TW"];
const fileNames = { "zh-CN": "zh", "zh-TW": "zh-hant" };
const hangul = /[가-힣]/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
}

function collectText(source, fileName, result) {
  const kind = extname(fileName) === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const tree = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, kind);
  function visit(node) {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) && hangul.test(node.text)) {
      const value = node.text.trim().replace(/\s+/g, " ");
      if (value && !value.startsWith("//")) result.add(value);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
}

function protect(text) {
  return text.replace(/\{[^}]+\}/g, (value) => `__GX_${Buffer.from(value).toString("hex")}__`);
}

function restore(text) {
  return text.replace(/__GX_([0-9a-f]+)__/gi, (_, hex) => Buffer.from(hex, "hex").toString());
}

async function translate(text, target) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({ client: "gtx", sl: "ko", tl: target, dt: "t", q: protect(text) });
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.json();
      return restore(body[0].map((part) => part[0]).join(""));
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  throw new Error(`Translation failed (${target}): ${text}`);
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

const values = new Set();
for (const sourceRoot of sourceRoots) {
  for (const file of await walk(join(root, sourceRoot))) {
    if (![".ts", ".tsx"].includes(extname(file))) continue;
    collectText(await readFile(file, "utf8"), relative(root, file), values);
  }
}

await mkdir(outputDir, { recursive: true });
const ordered = [...values].sort((a, b) => a.localeCompare(b, "ko"));
await writeFile(join(outputDir, "ko.json"), `${JSON.stringify(Object.fromEntries(ordered.map((value) => [value, value])), null, 2)}\n`);

if (process.argv.includes("--extract-only")) {
  console.log(`Extracted ${ordered.length} Korean UI and mock-data strings.`);
  process.exit(0);
}

for (const target of targets) {
  const fileName = fileNames[target] ?? target;
  try {
    const existing = JSON.parse(await readFile(join(outputDir, `${fileName}.json`), "utf8"));
    if (Object.keys(existing).length === ordered.length && ordered.every((source) => source in existing)) {
      console.log(`${target}: reused ${ordered.length}/${ordered.length}`);
      continue;
    }
  } catch {
    // Missing or invalid output is regenerated below.
  }
  let completed = 0;
  const valuesForTarget = await mapWithConcurrency(ordered, 6, async (source) => {
    const value = await translate(source, target);
    completed += 1;
    if (completed % 50 === 0) process.stdout.write(`\r${target}: ${completed}/${ordered.length}`);
    return value;
  });
  const translated = Object.fromEntries(ordered.map((source, index) => [source, valuesForTarget[index]]));
  await writeFile(join(outputDir, `${fileName}.json`), `${JSON.stringify(translated, null, 2)}\n`);
  console.log(`\r${target}: ${ordered.length}/${ordered.length}`);
}

const digest = createHash("sha256").update(ordered.join("\n")).digest("hex");
console.log(`Generated ${ordered.length} UI strings (source sha256 ${digest}).`);
