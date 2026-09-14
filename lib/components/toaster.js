import * as ze from "#styled"
import { Toast } from "./toast.js"

const state = ze.proxy({
    topLeft: [],
    centerLeft: [],
    bottomLeft: [],
    topRight: [],
    centerRight: [],
    bottomRight: [],
    topCenter: [],
    bottomCenter: [],
})
const stackList = [
    ["topLeft", "top-left"],
    ["centerLeft", "center-left"],
    ["bottomLeft", "bottom-left"],
    ["topRight", "top-right"],
    ["centerRight", "center-right"],
    ["bottomRight", "bottom-right"],
    ["topCenter", "top-center"],
    ["bottomCenter", "bottom-center"],
]
export const Toaster = (props) => {
    const stacks = ze.sharedState(state)

    const toasters = stackList.map(
        (pair) => {
            const [key, pos] = pair
            const stack = stacks[key]
            const toasts = stack.map(
                (toastInfo) => {
                    const { key, content, ...props } = toastInfo
                    return (
                        <Toast {key} {...props}>
                            {content}
                        <//>
                    )
                }
            )
            return (
                <ws-toaster {pos} {key}>
                    <ze.Transitions>
                        {toasts}
                    <//>
                <//>
            )
        }
    )
    return (
        <ze-toasters>{toasters}<//>
    )
}

const skipEvent = Symbol("toaster timeout")
Toaster.show = (opts) => {
    const {
        pos,
        timeout = 5000,
        ...options
    } = opts
    const key = ze.randKey()

    const dismiss = (skip) => {
        clearTimeout(timer)
        state[pos] = state[pos].filter(
            toast => toast.key !== key
        )
        if (skip === skipEvent) {
            return
        }
        options.ondismiss?.()
    }
    const timer = setTimeout(
        () => dismiss(skipEvent),
        timeout
    )

    state[pos].push(
        ze.ref({
            $animate: [ze.fade(100)],
            ...options,
            dismiss,
            key,
        })
    )
}
