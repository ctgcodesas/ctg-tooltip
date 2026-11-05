import { LitElement, css, html } from 'lit'

// Small grace period so the pointer can travel from the trigger to the
// tooltip without it closing in between.
const HIDE_DELAY = 100

let nextId = 0

export class CtgTooltip extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
  }

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }

    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      z-index: 20;
      width: max-content;
      max-width: 16rem;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background: #1f2937;
      color: #fff;
      font-size: 0.875rem;
      line-height: 1.4;
      opacity: 0;
      visibility: hidden;
      transform: translate(-50%, 0.25rem);
      transition:
        opacity 150ms ease,
        transform 150ms ease,
        visibility 150ms;
    }

    :host([open]) .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, 0);
    }

    @media (prefers-reduced-motion: reduce) {
      .tooltip {
        transition: none;
      }
    }
  `

  declare open: boolean

  private hideTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    this.open = false
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('pointerenter', this.show)
    this.addEventListener('pointerleave', this.scheduleHide)
    this.addEventListener('focusin', this.show)
    this.addEventListener('focusout', this.hide)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pointerenter', this.show)
    this.removeEventListener('pointerleave', this.scheduleHide)
    this.removeEventListener('focusin', this.show)
    this.removeEventListener('focusout', this.hide)
    document.removeEventListener('keydown', this.onKeydown)
    clearTimeout(this.hideTimer)
  }

  show = () => {
    clearTimeout(this.hideTimer)
    this.open = true
  }

  hide = () => {
    clearTimeout(this.hideTimer)
    this.open = false
  }

  private scheduleHide = () => {
    clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(this.hide, HIDE_DELAY)
  }

  private onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.hide()
  }

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has('open')) return

    // Only listen for Escape while the tooltip is visible.
    if (this.open) {
      document.addEventListener('keydown', this.onKeydown)
    } else {
      document.removeEventListener('keydown', this.onKeydown)
    }
  }

  // Links the trigger with the tooltip text so screen readers announce it.
  private linkContent() {
    const trigger = this.querySelector(':scope > :not([slot])')
    const content = this.querySelector(':scope > [slot="content"]')
    if (!trigger || !content) return

    if (!content.id) content.id = `ctg-tooltip-${++nextId}`
    trigger.setAttribute('aria-describedby', content.id)
  }

  render() {
    return html`
      <slot @slotchange=${this.linkContent}></slot>
      <div class="tooltip" part="tooltip" role="tooltip">
        <slot name="content" @slotchange=${this.linkContent}></slot>
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
