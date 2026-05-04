# Expo Example

Minimal Expo app for testing `react-native-turnstile-next` locally.

```sh
cd examples/expo
npm install
npx expo install react-native-webview
npm run ios
```

Replace `SITE_KEY` and `TURNSTILE_DOMAIN` in `App.tsx` with your Cloudflare Turnstile values before testing with a real widget.

The example demonstrates:

- `ref.current.execute()`
- `ref.current.reset()`
- required `domain`
- `webViewProps`
- structured `onError` output
