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
            entry: {
                index: resolve(__dirname, "src/index.ts"),
                ...entries,
            },
            formats: ["es", "cjs"],
            fileName: (format, entryName) => {
                const extension = format === "es" ? ".mjs" : ".cjs";
                return `${entryName}${extension}`;
            },
        },
        rollupOptions: {
            external: ["tslib"],
            output: [
                {
                    preserveModules: true,
                    preserveModulesRoot: "src",
                    dir: "dist",
                    format: "es",
                    entryFileNames: "[name].mjs",
                },
                {
                    preserveModules: true,
                    preserveModulesRoot: "src",
                    dir: "dist",
                    format: "cjs",
                    entryFileNames: "[name].cjs",
                },
            ],
        },
    },
    plugins: [
        dts({
            rollupTypes: false,
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts"],
            compilerOptions: {
                baseUrl: ".",
                paths: {
                    "@/*": ["./src/*"],
                },
            },
        }),
    ],
});
