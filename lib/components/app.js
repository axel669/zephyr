import { DialogStack } from "./dialog.js"
import { Surface } from "./surface.js"
import { Toaster } from "./toaster.js"

export const App = (props) => {
    const {
        ws = "",
        layout = null,
        theme,
        children,
    } = props

    document.body.dataset.ws = `#theme.${theme}; ${ws}`

    return <#frag>
        <Surface {layout} ws="r: 0px;" data-app-surface>
            {children}
        <//>
        <DialogStack />
        <Toaster />
    </>
}
