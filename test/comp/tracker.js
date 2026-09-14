import * as gale from "@axel669/galejs"
// import * as ze from "../zephyr/main.js"

import { chars } from "#state/chars"

const Paper = gale.style(gale.Paper)`
    raised;
    r: 0px;
    var.outln;
`
const SaveDot = gale.style("div")`
    bg.c: hsl(@color, @layer-element);
    r: 50%;
    w: 20px;
    h: 20px;
`
const SaveRow = gale.style(gale.Flex)`
    fl.dir: row;
    fl.main: space-between;
`
const dotNums = [1, 2, 3]
const Saves = (props) => {
    const { char, color, prop, label } = props

    const count = char[prop]
    const inc = () => char[prop] = Math.min(count + 1, 3)
    const dec = () => char[prop] = Math.max(count - 1, 0)

    const dots = dotNums.map(
        num => <SaveDot ws=`@color: {(num <= count) ? color : "@mono"};` />
    )

    return (
        <gale.Grid ws="gr.cols: 1fr min-content 100px min-content; p: 0px; gap: 4px;">
            <gale.Text ws="flex; fl.cn;">{label}<//>
            <gale.Button ws="p: 8px;" on:click={dec}>
                <gale.Icon name="circle-minus" />
            </gale.Button>
            <SaveRow>
                {dots}
            </SaveRow>
            <gale.Button ws="p: 8px;" on:click={inc}>
                <gale.Icon name="circle-plus" />
            </gale.Button>
        </gale.Grid>
    )
}

const HP = (props) => {
    const { char } = props

    const total = char.max + char.temp
    const alt = char.current + char.temp

    const progress = {
        value: char.current,
        max: total,
        buffer: alt,
        ws: "@color: @accent; r: 0px; h: 24px;",
    }
    return <gale.Progress {...progress} />
}

const forceNumber = () => ({ type: "number" })
const HPInput = gale.style("input", forceNumber)`
    w: 30px;
    bg.c: transparent;
    font: @font;
    t.a: center;
    ! &:focus {
        outln: none;
    }
`
const Label = gale.style(gale.Text)`
    t.a: center;
`
export const Tracker = (props) => {
    const { char, ...rest } = props

    const decs = () => char.success = Math.max(char.success - 1, 0)
    const incs = () => char.success = Math.min(char.success + 1, 3)
    const decf = () => char.fail = Math.max(char.fail - 1, 0)
    const incf = () => char.fail = Math.min(char.fail + 1, 3)
    const remove = () => chars.list.splice(
        chars.list.indexOf(char),
        1
    )

    return (
        <Paper {...rest}>
            {#slot header}
            <gale.Grid ws="gr.cols: 1fr min-content;">
                <gale.Text size="header">{char.name}<//>
                <gale.Button ws="@color: @error;" on:click={remove}>
                    <gale.Icon name="x" />
                <//>
            <//>
            {#/}

            <HP {char} />
            <gale.Grid ws="gr.cols: 1fr 240px;">
                <div ws="row: span 2;">
                    <Label>HP + Temp<//>
                    <div ws="b: 1px solid hsl(@info, @layer-border); flex; fl.main: space-between;">
                        <HPInput $$value={#char.current} />
                        <span>+<//>
                        <HPInput $$value={#char.temp} />
                    <//>
                    <Label>Max HP<//>
                    <div ws="b: 1px solid hsl(@info, @layer-border);">
                        <HPInput $$value={#char.max} ws="w: 100%;" />
                    <//>
                <//>
                <Saves {char} label="Success" prop="success" color="@success" />
                <Saves {char} label="Fail" prop="fail" color="@error" />
            <//>
        <//>
    )
}
