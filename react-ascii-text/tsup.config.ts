import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  treeshake: true,
  sourcemap: false,
  clean: true,
  dts: true,
  splitting: false,
  format: ["esm"],
  external: ["react"],
  injectStyle: false,
  skipNodeModulesBundle: true,
});
