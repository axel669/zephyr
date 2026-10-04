import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import html from "@axel669/rollup-html-input"
import replace from "@rollup/plugin-replace"

import gale from "@axel669/zephyr/rollup"

export default {
    input: "./test/index.html",
    output: {
        file: "./test/artifacts/app.js",
        format: "esm",
    },
    plugins: [
        html(),
        gale(),
        resolve(),
        commonjs(),
        replace({
            "@axel669/zephyr": "@axel669/zephyr/dev"
        }),
        terser(),
    ]
}
