import fs from "fs-jetpack"

import { transpile } from "./transpiler.js"

const defaults = {
    sourceImport: "@axel669/zephyr"
}
export default (options) => {
    const opts = {
        ...defaults,
        ...options,
    }
    return {
        name: "zephyr",
        async load(filepath) {
            if (filepath.includes("node_modules") === true) {
                return null
            }
            const source = fs.read(filepath)
            const code = await transpile({
                filename: filepath,
                source,
                sourceImport: opts.sourceImport
            })
            return code
        }
    }
}
