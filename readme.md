# Zephyr
Zephyr is a component suite with extension to the JSX syntax, built on top of
preact and valtio.

## Syntax Extensions

### Short Closing Tags
`<//>` can be used to close any tag without repeating its name. This is most
useful with the Extended Tag Names that Zephyr also allows.
```jsx
const div = <div>Content<//>
```

### Extended Tag Names
Tag names can have the usual html tags and dot notation (thing.component), but
Zephyr also allows function calls as tag names. The normal rules apply for the
standard tags (capitalized single words are interpreted as component functions),
and the function return syntax is always treated as that.

```jsx
// Allowed
<div />
<custom-tag />
<Component />
<zephyr.Button />
<zephyr.Suspend(Thing) />
```

### Fragments
Preact Fragments are usable using the `Fragment` component, but the normal
shorthand is not allowed. `<>` is nice until someone filled in a placeholder
and forgot to go back and put the component they intended. To fix this, Zephyr
uses `<#frag>` for fragment opening tags, so that its always clear a fragment
was the intention at that point. The `key` prop is still supported as normal.
```jsx
const fragment = (
    <#frag>
        Content
    <//>
)
```

### on:X Event Props
Zephyr allows `on:X` in addition to `onX` for event handler props, because I
like the syntax with the colon in it. The transpiler will convert the `on:X`
props at transpile time, so they will arrive as their `onX` version during
runtime.
```jsx
<input on:input={handler} />
```

### #effect
The function call of useEffect bothers me because of the added indentation so
Zephyr transpiles `#effect [...items] {}` blocks into the useEffect function
setup that is required, but it looks nicer in the file.
```js
const Component = (props) => {
    #effect [props.thing] {
        // do effec stuff here
    }
}
```

### {prop} Shorthand
Props that use the same name as the variable they are pulling from can be sent
to components by just saying `{<name>}` just like in Svelte.
```jsx
<Component {prop} another={value} />
```

### $$props
Adding event listeners separetely from the values they are working with can get
annoying fast, so Zephyr allows a shorthand to set both values in one prop
using a single object (which also has its own shorthand).

Props starting with "`$$`" need to take in values that are objects of the form
`{ value, update }`. Zephyr will pass the prop through the components under the
`$$<name>` prop, and will automatically expand it when the prop is sent to an
html element, so that wrapper components can modify or use them as needed.

When the prop is sent to an html element, the `.value` is sent to the prop named
after the `$$`, and the `.update` is sent to the defined event handler. Custom
associations can be created for html elements adding to the `eventNames` mapping
that is exported by Zephyr. Additionally, the value that comes from the element
is processed and sent to the update function, and handle things like numeric
inputs and date inputs. Custom behavior can also be registered for this step
using the `registerInputValue` function.

Finally, when binding to a piece of valtio state, the value can start with a `#`
and it will automatically have an update function created that assigns back to
the value, so the case of tracking a value can be done with very little syntax.

```jsx
import * as zephyr from "@axel669/zephyr"

// this is defined in the library, but this is how it would look to create one
ze.eventNames["input.value"] = "input"

let thingValue = ""
const thingBind = {
    get value() { return thingValue },
    update(nextValue) {
        thingValue = nextValue.toUpperCase()
    }
}
// this will be expanded to:
// value={thingBind.value} oninput={thingBind.update}
const thing = <input type="text" $$value={thingBind} />


const state = ze.proxy({
    text: ""
})
// this will be expanded to:
// value={state.text} oninput={(next) => state.text = next}
const thing2 = <input type="text" $$value={#state.text} />
```

### $: Render
If a tag starts with `$:` the underlying component will evaluate the variable
and render based on the result:
- `value === null || value === undefined` -> null
- `typeof value === "string"` -> renders the string as a string
- else -> renders as a component (and props can be passed)
```jsx
const things = [null, "string", zephyr.Button]

const items = (
    <#frag>
        // wont render anything (null)
        <$:things[0] />
        // renders "string" as text
        <$:things[1] />
        // renders the Button component
        <$:things[2] />
    <//>
)
```

### If
Conditionally renders and item. This can be done using the ternary operator
that react loves to have, but I think it looks better in the template, and
that's what this syntax allows.

Defined using the syntax `{#if <condition>}...{#else}...{#/}` with the else
block not being required.
```jsx
<div>
    {#if Math.random() < 0.5)}
        <span>Low Number<//>
    {#else}
        <span>High Number<//>
    {#/}
<//>
```

### Each
Renders a list of items with an optional fallback if no items are in the source
list. Can be accomplished using the map function outside of the JSX, but like
the case with the `if` I think it's nicer to have it inside the template
sometimes.

Defined using the syntax `{#each <list> -> <map args>}...{#else}...{#/}`
```jsx
const list = [1, 2, 3, 4]

<#frag>
    {#each list -> number, index}
        <div>Item #{index}: {number}<//>
    {#else}
        <div>No items<//>
    {#/}
<//>
```

### Slots
Slots function similar to how they work in Svelte. They can be defined inline
or using the `slot:<name>` props, and are always passed in a `slot` property
in component props.

Slots are defined inline using `{#slot <name>}...{#/}`
```jsx
const Component = (props) => {
    return (
        <div>
            <props.slot.header />
            {children}
        <//>
    )
}

const thing = (
    <Component>
        {#slot header}
        <div>Header<//>
        {#/}

        Content
    <//>
)
```
