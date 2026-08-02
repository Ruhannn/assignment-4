# Setting Up a TypeScript + Node.js Backend with Prisma, tsup, and Vercel

This guide walks through setting up a Node.js backend written in TypeScript, using Prisma for the database layer, tsup to bundle it, and Vercel to deploy it.

## 1. Initialize the project

```bash
npm init -y
```

This creates a `package.json` with default values, which you can edit later (name, scripts, etc.).

## 2. Set up TypeScript

```bash
tsc --init
```

This generates a `tsconfig.json`. Two settings matter most for a modern Node project:

```json
"moduleResolution": "bundler",
"target": "esnext"
```

`moduleResolution: "bundler"` tells TypeScript to resolve imports the way modern bundlers do, rather than mimicking Node's older CommonJS resolution rules. `target: "esnext"` compiles to the latest JavaScript features instead of down-leveling to an older spec.

## 3. Add Node's built-in types

Node globals like `process` and `Buffer` aren't part of the TypeScript standard library by default, so you need to add them:

```json
"lib": ["esnext"],
"types": ["node"]
```

Then install the type definitions:

```bash
npm install -D @types/node
```

## 4. Add Prisma

Install Prisma and initialize it:

```bash
npm i prisma
```

```bash
prisma init
```

This creates a `prisma/schema.prisma` file and a `.env` file for your database connection string. From here, you'd define your models in `schema.prisma` and run `prisma generate` to create the client.

## 5. Bundle with tsup

Install tsup and create a config file, `tsup.config.ts`:

```ts
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
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
```

Most of this is straightforward: bundle everything in `src/server.ts` into a single minified ESM file in `dist/`. The `banner` is there because some npm packages still use `require()` internally, and plain ESM doesn't have `require` available. The banner recreates it using Node's `createRequire`, so those packages keep working after bundling.

## 6. Write `server.ts` so it only listens locally

```ts
if (config.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
  });
}
```

This check matters because platforms like Vercel run your app as a serverless function rather than a long-running process. In production, Vercel handles incoming requests itself and never needs your code to call `app.listen()`. Locally, though, you do want the server listening on a port so you can test it in a browser. The check keeps both cases working from the same file.

## 7. Deploy

```bash
vercel --prod
```

This builds and deploys the current project straight to production on Vercel.

---

**Order of operations, if you're following along step by step:**
`npm init` → `tsc --init` (+ Node types) → `prisma init` → write your Prisma schema → set up `tsup.config.ts` → write `server.ts` → `vercel --prod`.
