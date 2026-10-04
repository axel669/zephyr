import { cloneElement } from "./core.js"
import { lock, localState } from "./hooks.js"
import { randName } from "./rand-name.js"

const style = document.createElement("style")
style.setAttribute("data-name", "zephyr-animations")
document.head.append(style)

export const animation = (config) => {
    const keyframes = []
    for (const [frame, styles] of Object.entries(config)) {
        const entries = Object.entries(styles).map(
            (entry) => `${entry[0]}: ${entry[1]};`
        )
        keyframes.push(`${frame} { ${entries.join("")} }`)
    }
    const name = `keyframes-${randName()}`
    style.sheet.insertRule(`@keyframes ${name} { ${keyframes.join(" ")} }`)
    style.sheet.insertRule(`@keyframes ${name}-r { ${keyframes.join(" ")} }`)
    return (duration, ease = "linear") =>
        (suffix) => `${name}${suffix} ${duration}ms ${ease}`
}
export const fade = animation({
    "0%": {
        opacity: 0
    },
    "100%": {
        opacity: 1
    },
})
export const drop = animation({
    "0%": {
        scale: 1.4
    },
    "100%": {
        scale: 1
    },
})
export const pop = animation({
    "0%": {
        scale: 0.6
    },
    "100%": {
        scale: 1
    },
})
export const slideTop = animation({
    "0%": {
        translate: "0 -50px"
    },
    "100%": {
        translate: "0 0px"
    },
})
export const slideBottom = animation({
    "0%": {
        translate: "0 50px"
    },
    "100%": {
        translate: "0 0px"
    },
})
export const visible = animation({
    "0%": {
        visibility: "hidden",
    },
    "100%": {
        visibility: "visible",
    },
})
export const spinCW = animation({
    "0%": {
        rotate: "0deg",
    },
    "100%": {
        rotate: "360deg",
    },
})
export const fromLeft = animation({
    "0%": {
        translate: "-100% 0"
    },
    "100%": {
        translate: "0% 0"
    },
})
export const fromRight = animation({
    "0%": {
        translate: "100% 0"
    },
    "100%": {
        translate: "0% 0"
    },
})
export const fromTop = animation({
    "0%": {
        translate: "0 -100%"
    },
    "100%": {
        translate: "0 0%"
    },
})
export const fromBottom = animation({
    "0%": {
        translate: "0 100%"
    },
    "100%": {
        translate: "0 0%"
    },
})

const register = (keyed, child, pos, local) => {
    if (keyed.has(child.key) === true) {
        const item = keyed.get(child.key)
        item.child = child
        item.active = (item.phase === "none") ? child : item.active
        return item
    }
    const enter = [child.props.$enter ?? child.props.$animate].flat()
    const exit = [child.props.$exit ?? child.props.$animate].flat()
    const item = {
        pos,
        child,
        phase: "enter",
        anims: {
            enter: enter.map(anim => `${anim("")} 0s 1 normal forwards`).join(", "),
            enterCount: enter.length,
            exit: exit.map(anim => `${anim("-r")} 0s 1 reverse forwards`).join(", "),
            exitCount: exit.length,
        },
        clone(style, events) {
            const baseStyle = child.props?.style ?? ""
            return cloneElement(
                child,
                {
                    ...child.props,
                    style: `${baseStyle};animation: ${style};`,
                    ...events,
                }
            )
        },
    }
    let count = 0
    item.active = item.clone(
        item.anims.enter,
        {
            "onanimationend": () => {
                count += 1
                if (count < item.anims.enterCount) {
                    return
                }
                item.phase = "none"
                item.active = item.clone("none", {})
                local.update = Math.random()
            }
        }
    )
    keyed.set(child.key, item)
    return item
}
export const Transitions = (props) => {
    const { children, enter, exit = enter, anim } = props
    const keyed = lock(new Map())
    const local = localState({
        update: null
    })

    const display = []
    const current = children.map(
        (child, pos) => {
            const item = register(keyed, child, pos, local)
            display.push(
                item.active
            )
            return child.key
        }
    )
    keyed.keys().forEach(
        key => {
            if (current.includes(key) === true) {
                return
            }
            const item = keyed.get(key)
            if (item.phase === "exit") {
                display.splice(item.pos, 0, item.active)
                return
            }
            let count = 0
            item.phase = "exit"
            item.active = item.clone(
                item.anims.exit,
                {
                    "onanimationend": () => {
                        count += 1
                        if (count < item.anims.exitCount) {
                            return
                        }
                        keyed.delete(key)
                        local.update = Math.random()
                    }
                }
            )
            display.splice(item.pos, 0, item.active)
        }
    )

    return display
}
