# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Show the tooltip on hover and keyboard focus, and hide it with `Escape`.
- Link the trigger to the tooltip text with `aria-describedby`.
- `placement` attribute to choose the preferred side of the tooltip.
- The tooltip flips and shifts to stay inside the viewport.
- Arrow pointing at the trigger.
- `trigger` attribute (`hover`, `focus`, `click`, `manual`) so the tooltip also works on touch screens.
- `show-delay`, `hide-delay` and `offset` attributes.
- Theming through `--ctg-tooltip-*` CSS custom properties, plus `tooltip` and `arrow` CSS parts.
