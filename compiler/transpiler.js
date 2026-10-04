import fs from "fs-jetpack"
import * as parser from "./parser.js"
import * as prettier from "prettier"

const stringifyContent = (content, props) => content.reduce(
    (list, child) => {
        if (child === null) {
            return list
        }
        if (typeof child === "string") {
            if (child.trim() === "") {
                return list
            }
            return [...list, JSON.stringify(child)]
        }
        if (child.slot !== undefined) {
            const content = stringifyContent(child.content).join(", ")
            props.push([
                `slot:${child.slot}`,
                `(${child.propName ?? ""}) => [${content}]`
            ])
            return list
        }
        if (child.condition !== undefined) {
            const content = child.content.map(
                child => stringifyPart(child)
            ).join(", ")
            const alt = child.alt.map(
                child => stringifyPart(child)
            ).join(", ")
            return [
                ...list,
                `(${child.condition}) ? [${content}] : [${alt}]`
            ]
        }
        if (child.each !== undefined) {
            const content = stringifyContent(child.content).join(", ")
            const each = `(${child.each})?.map((${child.expand}) => [${content}]) ?? []`
            if (child.alt.length === 0) {
                return [
                    ...list,
                    each
                ]
            }
            const alt = stringifyContent(child.alt)
            return [
                ...list,
                `$galeCore.__eachAlt(${each}, () => [${alt}])`
            ]
        }
        return [...list, stringifyPart(child)]
    },
    []
)

const tagstr = (isHTML, tag) => {
    if (isHTML === true) {
        return `"${tag}"`
    }
    return tag
}
const stringifyPart = (part) => {
    if (typeof part === "string") {
        return part
    }
    if (part.js !== undefined) {
        return part.js
    }
    if (part.react !== undefined) {
        return `$galeCore.useEffect(() => {${part.code}}, ${part.react})`
    }
    if (part.component !== undefined) {
        return `memo((props) => ${part.component} , valtimemo)`
    }

    const props = [ ...part.props ]
    const children = stringifyContent(part.children, props)
    const isHTMLElement = (/^[a-z\-_]+$/.test(part.tag) === true)
    const propsCode = props.map(
        (pair) => {
            if (typeof pair === "string") {
                return pair
            }
            const [prop, value] = pair
            if (prop.startsWith("$$") === true && value.startsWith("#") === true) {
                const key = prop.slice(2)
                const val = value.slice(1)
                return `"${prop}": { value: ${val}, update: (e) => ${val} = $galeCore.getInputValue(e.target) }`
            }
            if (value.startsWith("&") === true) {
                const val = value.slice(1)
                return `"${prop}": $galeCore.lock((node) => ${val} = $galeCore.ref(node))`
            }
            if (prop.startsWith("on:") === true) {
                return `"${prop.replace(":", "")}": ${value}`
            }
            return `"${prop}": ${value}`
        }
    ).join(", ")
    const tag = tagstr(isHTMLElement, part.tag)
    if (part.tag.startsWith("$:") === true) {
        return `$galeCore.Element($galeCore.Slot, { "*render": ${tag.slice(2)}, ${propsCode} })`
    }
    if (children.length === 0) {
        return `$galeCore.Element(${tag}, {${propsCode}})`
    }
    return `$galeCore.Element(${tag}, {${propsCode}},\n${children.join(",\n")}\n)`
}
const stringify = (parts) =>
    parts.map(stringifyPart)
    .join("")
const done = (parts) =>
    parts.find(part => typeof part !== "string") === undefined
export const transpile = (options) => {
    const {
        filename,
        source,
        sourceImport = "@axel669/zephyr",
    } = options

    let step = parser.parse(source)
    if (done(step) === true) {
        return source
    }
    while (done(step) === false) {
        step = parser.parse(
            stringify(step)
        )
    }
    return prettier.format(
        `import * as $galeCore from "${sourceImport}"\n${step.join("")}`,
        {
            printWidth: 70,
            experimentalOperatorPosition: "start",
            tabWidth: 4,
            semi: false,
            parser: "babel",
        }
    )
}
