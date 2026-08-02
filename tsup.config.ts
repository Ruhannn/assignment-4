import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: ["esnext"],
  platform: "node",
  outDir: "dist",
  bundle: true,
  minify: true,
  banner: {
    js: /* ts */ `
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
    `,
  },
});
