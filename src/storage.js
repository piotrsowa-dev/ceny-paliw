import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "data/prices.json");

const empty = {
  hurt: { pb95: null, pb98: null, on: null, lpg: null, updated: null },
  detal: { pb95: null, pb98: null, on: null, updated: null },
  brent: { price: null, updated: null},
};

export function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return structuredClone(empty);
  }
}

export function write(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}