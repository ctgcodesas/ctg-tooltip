import { css } from 'lit'

export const styles = css`
  :host {
    display: inline-block;
  }

  /* Every visual value reads a --ctg-tooltip-* custom property with the
     default as fallback. Custom properties cross the shadow boundary, so
     they can be set from the page on the element or any ancestor. */
  .tooltip {
    /* Fixed so it isn't clipped by ancestors with overflow: hidden. */
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--ctg-tooltip-z-index, 1000);
    box-sizing: border-box;
    width: var(--ctg-tooltip-width, max-content);
    max-width: var(--ctg-tooltip-max-width, 16rem);
    padding: var(--ctg-tooltip-padding, 0.5rem 0.75rem);
    border-radius: var(--ctg-tooltip-radius, 0.5rem);
    background: var(--ctg-tooltip-background, #1f2937);
    box-shadow: var(--ctg-tooltip-shadow, none);
    color: var(--ctg-tooltip-color, #fff);
    font-size: var(--ctg-tooltip-font-size, 0.875rem);
    line-height: var(--ctg-tooltip-line-height, 1.4);
    text-align: var(--ctg-tooltip-text-align, start);
    opacity: 0;
    visibility: hidden;
    transform: translate(var(--slide-x, 0), var(--slide-y, 0));
    transition-property: opacity, transform, visibility;
    transition-duration: var(--ctg-tooltip-duration, 150ms);
    transition-timing-function: ease;
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

  /* The arrow is a rotated square with the tooltip's background. JS
     measures it to make it stick out by half its size. */
  .arrow {
    position: absolute;
    width: var(--ctg-tooltip-arrow-size, 0.5rem);
    height: var(--ctg-tooltip-arrow-size, 0.5rem);
    border-radius: var(--ctg-tooltip-arrow-radius, 0);
    background: inherit;
    transform: rotate(45deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .tooltip {
      transition: none;
    }
  }
`
