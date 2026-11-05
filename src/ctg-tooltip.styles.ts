import { css } from 'lit'

export const styles = css`
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
