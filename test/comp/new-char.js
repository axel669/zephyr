import * as gale from "@axel669/galejs"
// import * as ze from "../zephyr/main.js"

import { chars } from "../state/chars.js"

const Surface = gale.style(gale.Paper)`
    #animate;
    var.outln;
    pos.abs;
    y: calc(@y + 24px);
    inset.x: 24px;
    t.c: @page-text-color;
    raised;
`
const FillButton = gale.style(gale.Button)`
    var.fill;
`

export const NewChar = (props) => {
    const list = gale.sharedState(chars.list)

    const local = gale.localState({
        name: "",
    })
    const add = (hide) =>
        () => {
            list.push({
                id: Date.now().toString(32),
                name: local.name,
                max: 0,
                current: 0,
                temp: 0,
                success: 0,
                fail: 0,
            })
            close(hide)()
        }
    const close = (hide) =>
        () => {
            local.name = ""
            hide()
        }

    return (
        <gale.Popover ws="grid;" persistent>
            {#slot content:show}
            <gale.Button onClick={show}>
                New
            <//>
            {#/}

            {#slot overlay:hide}
            <Surface>
                <gale.ControlLabel label="Charcter Name">
                    <input type="text" $$value={#local.name} />
                <//>
                <gale.Grid ws="gr.cols: 1fr 1fr;">
                    <FillButton on:click={close(hide)} ws="@color: @error;">
                        Cancel
                    <//>
                    <FillButton on:click={add(hide)} ws="@color: @success;">
                        Add
                    <//>
                <//>
            <//>
            {#/}
        <//>
    )
}
