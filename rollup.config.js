import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";
//import istanbul from 'rollup-plugin-istanbul';
import typescript from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";

let pkg = require("./package.json");
let external = Object.keys(pkg.dependencies);

let plugins = [
    typescript({
        tsconfig: "./tsconfig.json"
    }),
    babel(babelrc()),
    uglify()
];

export default [
    {
        input: "src/index.ts",
        plugins: plugins,
        external: external,
        output: [
            {
                file: "dist/kudo.iife.js",
                format: "iife",
                name: "kudoJS",
                sourcemap: true
            },
            {
                file: "dist/kudo.cjs.js",
                format: "cjs",
                name: "kudoJS",
                sourcemap: true
            },
            {
                file: "dist/kudo.es.js",
                format: "es",
                name: "kudoJS",
                sourcemap: true
            }
        ]
    }
];
