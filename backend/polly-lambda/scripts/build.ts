import { build } from "esbuild";

build({
  entryPoints: ["src/handler.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "dist/handler.js",
  sourcemap: true,
  // Bundle dependencies to avoid packaging node_modules (Windows path length issues).
  // This makes SAM deploy zip only `dist/`.
  minify: true,
}).then(
  () => console.log("Built dist/handler.js"),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

