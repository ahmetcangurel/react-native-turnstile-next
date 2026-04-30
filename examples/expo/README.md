# Expo Example

Minimal Expo app for testing `react-native-turnstile-next` locally.

```sh
cd examples/expo
npm install
npx expo install react-native-webview
npm run ios
```

Replace `SITE_KEY` in `App.js` with your Cloudflare Turnstile sitekey before testing with a real widget.

The example demonstrates:

- `ref.current.execute()`
- `ref.current.reset()`
- `domain` and `path`
- `webViewProps`
- structured `onError` output
