export const eventNames = {
    "details.open": "toggle",
    "input.value": "input",
    "input.checked": "input",
    "select.value": "change",
    "select.selectedIndex": "change",
}
export const boolProps = [
    "allowfullscreen",
    "alpha",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "shadowrootclonable",
    "shadowrootcustomelementregistry",
    "shadowrootdelegatesfocus",
    "shadowrootserializable",
    // from windstorm
    "sticky-header"
]

export const tagGetValue = {
    details: (element) => element.open,
    input: (element) => {
        if (element.type === "checkbox") {
            return element.checked
        }
        if (element.type === "number") {
            if (isNaN(element.valueAsNumber) === true) {
                return null
            }
            return element.valueAsNumber
        }
        if (element.type === "date") {
            return element.valueAsDate
        }
        return element.value
    }
}
export const registerInputValue = (tag, getter) => {
    const name = tag.toLowerCase()
    if (tagGetValue[name] !== undefined) {
        return
    }
    tagGetValue[tag.toLowerCase()] = getter
}
