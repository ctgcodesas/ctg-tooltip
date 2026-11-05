import { LitElement, css, html } from 'lit'
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from '@floating-ui/dom'

// Small grace period so the pointer can travel from the trigger to the
// tooltip without it closing in between.
const HIDE_DELAY = 100

// Gap between the trigger and the tooltip, in px.
const OFFSET = 8

// Minimum distance kept from the viewport edges, in px.
const VIEWPORT_PADDING = 8

const OPPOSITE_SIDE = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const

let nextId = 0

export class CtgTooltip extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    placement: { type: String, reflect: true },
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    .tooltip {
      /* Fixed so it isn't clipped by ancestors with overflow: hidden. */
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      width: max-content;
      max-width: 16rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background: #1f2937;
      color: #fff;
      font-size: 0.875rem;
      line-height: 1.4;
      opacity: 0;
      visibility: hidden;
      transform: translate(var(--slide-x, 0), var(--slide-y, 0));
      transition:
        opacity 150ms ease,
        transform 150ms ease,
        visibility 150ms;
    }

    /* While hidden, the tooltip sits slightly towards the trigger so it
       slides out from it when shown. */
    .tooltip[data-side='top'] {
      --slide-y: 0.25rem;
    }
    .tooltip[data-side='bottom'] {
      --slide-y: -0.25rem;
    }
    .tooltip[data-side='left'] {
      --slide-x: 0.25rem;
    }
    .tooltip[data-side='right'] {
      --slide-x: -0.25rem;
    }

    :host([open]) .tooltip {
      --slide-x: 0;
      --slide-y: 0;
      opacity: 1;
      visibility: visible;
    }

    .arrow {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      background: inherit;
      transform: rotate(45deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .tooltip {
        transition: none;
      }
    }
  `

  declare open: boolean
  declare placement: Placement

  private hideTimer?: ReturnType<typeof setTimeout>
  private stopAutoUpdate?: () => void

  constructor() {
    super()
    this.open = false
    this.placement = 'top'
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
    this.stopPositioning()
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
    if (changed.has('open')) {
      // Only listen for Escape and track the position while visible.
      if (this.open) {
        document.addEventListener('keydown', this.onKeydown)
        this.startPositioning()
      } else {
        document.removeEventListener('keydown', this.onKeydown)
        this.stopPositioning()
      }
    } else if (changed.has('placement') && this.open) {
      this.updatePosition()
    }
  }

  private get tooltipEl() {
    return this.renderRoot.querySelector<HTMLElement>('.tooltip')!
  }

  private get arrowEl() {
    return this.renderRoot.querySelector<HTMLElement>('.arrow')!
  }

  // autoUpdate re-runs the positioning on scroll, resize and layout
  // changes, so it only runs while the tooltip is open.
  private startPositioning() {
    this.stopPositioning()
    this.stopAutoUpdate = autoUpdate(this, this.tooltipEl, () =>
      this.updatePosition(),
    )
  }

  private stopPositioning() {
    this.stopAutoUpdate?.()
    this.stopAutoUpdate = undefined
  }

  private async updatePosition() {
    const tooltip = this.tooltipEl
    const arrowEl = this.arrowEl

    const { x, y, placement, middlewareData } = await computePosition(
      this,
      tooltip,
      {
        strategy: 'fixed',
        placement: this.placement,
        middleware: [
          offset(OFFSET),
          flip({ padding: VIEWPORT_PADDING }),
          shift({ padding: VIEWPORT_PADDING }),
          arrow({ element: arrowEl, padding: 6 }),
        ],
      },
    )

    const side = placement.split('-')[0] as keyof typeof OPPOSITE_SIDE
    tooltip.dataset.side = side
    tooltip.style.left = `${x}px`
    tooltip.style.top = `${y}px`

    // The arrow follows the trigger even when shift() moved the tooltip,
    // and sticks out on the side facing the trigger.
    const arrowData = middlewareData.arrow
    Object.assign(arrowEl.style, {
      left: arrowData?.x != null ? `${arrowData.x}px` : '',
      top: arrowData?.y != null ? `${arrowData.y}px` : '',
      right: '',
      bottom: '',
      [OPPOSITE_SIDE[side]]: '-0.25rem',
    })
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
        <div class="arrow" part="arrow"></div>
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
