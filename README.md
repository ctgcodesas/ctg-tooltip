# ctg-tooltip

A tooltip built as a Web Component, so it works the same in React, Vue, Angular, Astro, Next or plain HTML.

- Positions itself and stays inside the viewport (flips and shifts when there's no room).
- Opens on hover, focus or click, so it also works on touch screens.
- Accessible: linked with `aria-describedby`, closes with `Escape`, respects reduced motion.
- Themeable with CSS custom properties, no build step or config needed.

> Work in progress, not published yet.

## Installation

```bash
npm install @ctgcode/tooltip
# or
bun add @ctgcode/tooltip
```

## Usage

Import the package once, anywhere in your app. That registers the `<ctg-tooltip>` element, which you can then use like any HTML tag.

```html
<script type="module">
  import '@ctgcode/tooltip'
</script>

<ctg-tooltip>
  <a href="https://ctgcode.com">CTG Code</a>
  <span slot="content">Get a quote</span>
</ctg-tooltip>
```

The first child is the trigger. The element with `slot="content"` is what the tooltip shows. Keep it short: screen readers read it as plain text when the trigger gets focus.

### Without a bundler

```html
<script type="module" src="https://esm.sh/@ctgcode/tooltip"></script>
```

### Astro

Import it in a `<script>` tag. Astro bundles it and runs it in the browser.

```astro
<ctg-tooltip>
  <a href="https://ctgcode.com">CTG Code</a>
  <span slot="content">Get a quote</span>
</ctg-tooltip>

<script>
  import '@ctgcode/tooltip'
</script>
```

### React

React 19 supports custom elements directly.

```jsx
import '@ctgcode/tooltip'

export function Credits() {
  return (
    <ctg-tooltip placement="bottom">
      <a href="https://ctgcode.com">CTG Code</a>
      <span slot="content">Get a quote</span>
    </ctg-tooltip>
  )
}
```

With TypeScript, declare the element once so JSX accepts it:

```ts
// ctg-tooltip.d.ts
import type { CtgTooltip } from '@ctgcode/tooltip'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ctg-tooltip': DetailedHTMLProps<HTMLAttributes<CtgTooltip>, CtgTooltip> &
        Partial<Pick<CtgTooltip, 'open' | 'placement' | 'trigger' | 'offset'>> & {
          'show-delay'?: number
          'hide-delay'?: number
        }
    }
  }
}
```

React 18 passes every prop as an attribute, so text and number attributes work but `open={false}` would still open it. Use `open` only on React 19, or control it through a ref (`ref.current.open = false`).

### Next.js

The element only exists in the browser, so load it from a client component:

```jsx
'use client'

import { useEffect } from 'react'

export function Credits() {
  useEffect(() => {
    import('@ctgcode/tooltip')
  }, [])

  return (
    <ctg-tooltip>
      <a href="https://ctgcode.com">CTG Code</a>
      <span slot="content">Get a quote</span>
    </ctg-tooltip>
  )
}
```

The server renders the tag as is and the tooltip starts working once the script loads. For TypeScript, use the declaration from the React section.

### Vue

Tell Vue that tags starting with `ctg-` are custom elements, so it doesn't try to resolve them as Vue components:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ctg-'),
        },
      },
    }),
  ],
})
```

Then import it and use it in any template:

```vue
<script setup>
import '@ctgcode/tooltip'
</script>

<template>
  <ctg-tooltip placement="bottom">
    <a href="https://ctgcode.com">CTG Code</a>
    <span slot="content">Get a quote</span>
  </ctg-tooltip>
</template>
```

With Nuxt, set the same option under `vue.compilerOptions.isCustomElement` in `nuxt.config.ts` and import the package from a client-only plugin (`plugins/ctg-tooltip.client.ts`).

### Angular

Add `CUSTOM_ELEMENTS_SCHEMA` to the component that uses the tag:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import '@ctgcode/tooltip'

@Component({
  selector: 'app-credits',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ctg-tooltip placement="bottom">
      <a href="https://ctgcode.com">CTG Code</a>
      <span slot="content">Get a quote</span>
    </ctg-tooltip>
  `,
})
export class CreditsComponent {}
```

Properties can be bound as usual, for example `[open]="isOpen"` or `[showDelay]="300"`.

## API

### Attributes and properties

| Attribute    | Property    | Default         | Description |
| ------------ | ----------- | --------------- | ----------- |
| `open`       | `open`      | `false`         | Whether the tooltip is visible. Reflected, so it can be styled with `ctg-tooltip[open]`. |
| `placement`  | `placement` | `'top'`         | Preferred side: `top`, `right`, `bottom` or `left`, optionally with `-start` or `-end` (e.g. `bottom-start`). It flips to the other side when there's no room. |
| `trigger`    | `trigger`   | `'hover focus'` | Space-separated list of `hover`, `focus` and `click`. `manual` disables all of them so you control `open` yourself. |
| `show-delay` | `showDelay` | `0`             | Milliseconds before showing on hover. |
| `hide-delay` | `hideDelay` | `100`           | Milliseconds before hiding when the pointer leaves. Gives the pointer time to reach the tooltip. |
| `offset`     | `offset`    | `8`             | Distance from the trigger, in px. |

With `click` in `trigger`, a click pins the tooltip open until the next click on the trigger, a click outside or `Escape`. On touch screens, the first tap on a link shows the tooltip and the second one follows the link.

### Methods

| Method   | Description |
| -------- | ----------- |
| `show()` | Shows the tooltip right away. |
| `hide()` | Hides the tooltip right away. |

### Slots

| Slot      | Description |
| --------- | ----------- |
| (default) | The trigger. Use a focusable element, like a link or a button, so keyboard users can reach it. |
| `content` | The tooltip's content. |

### CSS custom properties

Set them on the element or on any ancestor. Setting them on a container applies them to every tooltip inside it.

| Property                     | Default          |
| ---------------------------- | ---------------- |
| `--ctg-tooltip-background`   | `#1f2937`        |
| `--ctg-tooltip-color`        | `#fff`           |
| `--ctg-tooltip-width`        | `max-content`    |
| `--ctg-tooltip-max-width`    | `16rem`          |
| `--ctg-tooltip-padding`      | `0.5rem 0.75rem` |
| `--ctg-tooltip-radius`       | `0.5rem`         |
| `--ctg-tooltip-shadow`       | `none`           |
| `--ctg-tooltip-font-size`    | `0.875rem`       |
| `--ctg-tooltip-line-height`  | `1.4`            |
| `--ctg-tooltip-text-align`   | `start`          |
| `--ctg-tooltip-arrow-size`   | `0.5rem`         |
| `--ctg-tooltip-arrow-radius` | `0`              |
| `--ctg-tooltip-duration`     | `150ms`          |
| `--ctg-tooltip-z-index`      | `1000`           |

```css
footer ctg-tooltip {
  --ctg-tooltip-background: #f6f1e7;
  --ctg-tooltip-color: #0c2233;
  --ctg-tooltip-padding: 1rem;
  --ctg-tooltip-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.4);
}
```

### CSS parts

For anything the custom properties don't cover:

| Part      | Description |
| --------- | ----------- |
| `tooltip` | The tooltip box. |
| `arrow`   | The arrow. It takes the tooltip's background. |

```css
ctg-tooltip::part(tooltip) {
  border: 1px solid #e5e7eb;
  font-family: Georgia, serif;
}
```

The slotted content is regular page markup, so it can be styled with your usual CSS or utility classes.

## Development

```bash
bun install
bun run dev
```

`bun run dev` opens a demo page with every option. `bun run build` writes the package to `dist`.

## License

MIT
