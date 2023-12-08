import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/google-font.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
