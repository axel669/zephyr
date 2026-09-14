import * as gale from "@axel669/galejs"

const initial = JSON.stringify({
    list: [],
})
export const chars = gale.proxy(
    JSON.parse(
        localStorage.dndHP ?? initial
    )
)

gale.subscribe(
    chars,
    () => localStorage.dndHP = JSON.stringify(
        gale.snapshot(chars)
    )
)
window.chars = chars
