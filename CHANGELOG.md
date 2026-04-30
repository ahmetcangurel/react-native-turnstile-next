# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0 - 2026-04-30

### Added

- Renamed the package for npm publishing as `react-native-turnstile-next`.
- Added package metadata for the new GitHub repository and public npm publishing.
- Added CommonJS, ESM, and TypeScript declaration outputs.
- Added `domain` and `path` props for custom Turnstile bridge hosts.
- Added imperative `ref` API with `reset()`, `reload()`, and `execute()`.
- Added `webViewProps` for passing supported props to the internal `WebView`.
- Added structured `TurnstileError` objects based on Cloudflare Turnstile error codes.
- Exported public TypeScript types from the package root.
- Added an Expo example app in `examples/expo`.
- Added `LICENSE`.
- Added README credits noting that this package is a fork of `react-native-turnstile`.

### Changed

- Updated documentation to use `react-native-turnstile-next`.
- Updated Expo installation docs to use `npx expo install react-native-webview`.
- Reworked README usage examples to use valid component-scoped hooks and ref handling.
- Replaced pnpm workflow with npm and added `package-lock.json`.
- Kept `resetRef` and `resetTurnstile()` for compatibility while documenting the new ref API.
- Updated build configuration to generate both CJS and ESM bundles.
- Split source code into component, type, hook, and utility modules.

### Fixed

- Fixed README import examples and reset usage.
- Fixed query parameter serialization for valid falsy values such as `tabIndex={0}` and `responseField={false}`.
