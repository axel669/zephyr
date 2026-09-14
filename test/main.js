import * as ze from "@axel669/galejs"

const $enter = [ze.fade(175), ze.drop(175), ze.slideTop(175)]
const $exit = [ze.fade(175), ze.pop(175), ze.slideBottom(175)]

window.zephyr = ze

const options = [
    { label: "test1", value: "wat1" },
    { label: "test2", value: "wat2" },
    { label: "test3", value: "wat3" },
    { label: "test4", value: "wat4" },
]

const list = Array.from(
    { length: 10000},
    (_, i) => ({
        label: `Item ${i}`,
        n: i,
        mod: i % 4
    })
)

// const ContentSurface = ze.style(ze.Surface.Flex)`
//     layout.3row-controls;
//     w: 240px;
//     r: 0px;
//     raised;
// `
// const AppContainer = ze.style(ze.CardBase(ze.Layout))`
//     r: 0px;
// `
const AppSurface = ze.style(ze.Surface)`
    @col-a: 0px;
    r: 0px;

    ! |hover: hover| {
        @col-a: 240px;
    }
`

const baseState = JSON.stringify({
    menuOpen: false,
})
const appstate = ze.proxy(
    JSON.parse(
        localStorage.zeapp ?? baseState
    )
)

ze.subscribe(
    appstate,
    () => {
        localStorage.zeapp = JSON.stringify(appstate)
    }
)

const Sidebar = () => {
    return (
        <ze.Drawer ws="w: 240px;" $$open={#appstate.menuOpen} inline-desktop>
            <ze.Card ws="raise: 6; r: 0px;">
                {#slot header}
                <ze.Titlebar ws="@color: @info; var.fill;">
                    <ze.Text title>
                        Drawer
                    <//>

                    {#slot action}
                    <ze.Button on:click={() => appstate.menuOpen = false}>
                        <ze.Icon name="x" />
                    <//>
                    {#/}
                <//>
                {#/}

                <ze.Flex ws="scrollable;">
                    <ze.Text>
                        This is some text content inside the drawer area
                    <//>
                    <ze.Text>
                        This is some more content
                    <//>
                    {#each list -> item}
                    <div>{item.label}<//>
                    {#/}
                <//>
            <//>
        <//>
    )
}

let count = 0
const App = () => {
    ze.sharedState(appstate)
    const local = ze.localState({
        open: false,
        text: "",
        selected: "wat1",
        ref: null,
    })
    window.local = local

    console.log(
        ze.snapshot(local)
    )
    const onclick = async () => {
        console.log(
            await ze.Dialog.show({
                dialog: ze.Prompt,
                message: "Testing?",
                persistent: true,
                dialogWS: "y: 25%;",
                placeholder: "名前",
                // $animate: [ze.spinCW(250), ze.fade(250), ze.pop(250)],
            })
        )
    }
    const showToast = () => {
        count += 1
        ze.Toaster.show({
            pos: "bottomCenter",
            content: `test: ${count}`,
            $animate: [ze.fade(1000)],
            timeout: 3000,
        })
    }

    return <ze.App theme="tron" ws="*touch-action: manipulation;">
        <ze.Card ws="r: 0px;">
            {#slot header}
            <ze.Titlebar ws="@color: @primary; var.fill;">
                <ze.Text title>
                    Zephyr Testing
                <//>

                {#slot menu}
                <ze.Button on:click={() => appstate.menuOpen = true}>
                    <ze.Icon name="menu-2" ws="t.sz: 20px;" />
                <//>
                {#/}
            <//>
            {#/}

            <AppSurface layout="2col-sidebar">
                {#slot sidebar}
                <Sidebar />
                {#/}

                <ze.Flex>
                    <ze.Button on:click={showToast}>
                        Toasty
                    <//>
                <//>
            <//>
        <//>
    <//>
}

ze.renderApp(
    <App />,
    document.body
)
