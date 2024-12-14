import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { glob } from "glob";

// Get all TypeScript files from src, excluding test files
const entries = Object.fromEntries(
    glob.sync("src/**/!(*.test).ts").map((file) => [
        // Remove `src/` and `.ts` extension from entry name
        file.slice(4, -3),
        // Full path to file
        resolve(__dirname, file),
    ]),
);

export default defineConfig({
    build: {
        lib: {
            entry: entries,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["tslib"],
            output: [
                {
                    // preserveModules: true,
                    preserveModulesRoot: "src",
                    entryFileNames: `[name].es.js`,
                    dir: "dist",
                    format: "es",
                },
                {
                    // preserveModules: true,
                    preserveModulesRoot: "src",
                    entryFileNames: `[name].cjs.js`,
                    dir: "dist",
                    format: "cjs",
                },
            ],
        },
        sourcemap: true,
        minify: "esbuild",
        target: "es2022",
    },
    plugins: [
        dts({
            rollupTypes: true,
            include: ["src"],
            outDir: ["dist/types"],
        }),
    ],
});
