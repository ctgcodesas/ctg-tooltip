import { LitElement, css, html } from 'lit'

export class CtgTooltip extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }
  `

  render() {
    return html`
      <slot></slot>
      <div part="tooltip" role="tooltip">
        <slot name="content"></slot>
      </div>
    `
  }
}

if (!customElements.get('ctg-tooltip')) {
  customElements.define('ctg-tooltip', CtgTooltip)
}

declare global {
  interface HTMLElementTagNameMap {
    'ctg-tooltip': CtgTooltip
  }
}
