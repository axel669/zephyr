import { Button } from "./button.js"
import { Icon } from "./icon.js"

export const Toast = (props) => {
    const { children, dismiss, ...rest } = props

    return (
        <ws-toast {...rest}>
            <div ws="grid;" notif-text>{children}<//>
            <Button ws="area: end;" on:click={dismiss}>
                <Icon name="x" />
            <//>
        <//>
    )
}
