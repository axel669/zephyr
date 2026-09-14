import * as ze from "#styled"
import { Modal } from "./modal.js"

ze.options.eventNames["ws-modal.open"] = "close"
ze.options.registerInputValue("ws-modal", () => false)

const $animate = [ze.fade(175), ze.slideLeft(175)]
const DrawerDisplay = (props) => {
    const {
        "inline-desktop": inline,
        key,
        onclose,
        ...rest
    } = props

    return (
        <Modal inline-desktop={inline} {key} open managed {onclose}>
            <ws-drawer {...rest} />
        <//>
    )
}

export const Drawer = (props) => {
    const { open, $$open, onclose, ...rest } = props
    const key = ze.calc(
        () => ze.randKey()
    )
    const show = (open === true || $$open?.value === true)
    const close = $$open?.update ?? onclose

    return (
        <ze.Transitions>
            {#if show === true}
            <DrawerDisplay {key} {$animate} {...rest} onclose={close} />
            {#/}
        <//>
    )
}
