import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

copyFileSync(
  resolve("dist", "dynamic-map-card.js"),
  resolve("dynamic-map-card.js"),
);
