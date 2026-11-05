# ctg-tooltip

A tooltip built as a Web Component, so it works the same in React, Vue, Angular, Astro, Next or plain HTML.

> Work in progress, not published yet.

## Installation

```bash
npm install @ctgcode/tooltip
# or
bun add @ctgcode/tooltip
```

## Usage

```html
<script type="module">
  import '@ctgcode/tooltip'
</script>

<ctg-tooltip>
  <a href="https://ctgcode.com">CTG Code</a>
  <span slot="content">Get a quote</span>
</ctg-tooltip>
```

## Development

```bash
bun install
bun run dev
```

## License

MIT
