# react-native-turnstile-next

A React Native wrapper for [Cloudflare Turnstile](https://challenges.cloudflare.com) using `react-native-webview`.

## How It Works

The cookies used by Cloudflare Turnstile are incompatible with `react-native-webview`. This package loads a hosted bridge page inside a `WebView` and forwards Turnstile widget events back to your React Native app.

**Important**: Add `turnstile.1337707.xyz` to your Turnstile domains list. This is the hosted bridge domain used by this package.

## Installation

```sh
npm i react-native-turnstile-next react-native-webview
```

If you're running Expo, then:

```sh
npx expo install react-native-webview
npm install react-native-turnstile-next
```

## Usage

```tsx
import ReactNativeTurnstile from "react-native-turnstile-next";

function TurnstileWidget() {
  return (
    <ReactNativeTurnstile
      sitekey="xxxxxxxxxxxxxxxxxxx"
      onVerify={(token) => console.log(token)}
      onError={(error) => console.log(error)}
      style={{ alignSelf: "center" }}
    />
  );
}
```

Turnstile tokens expire after 5 minutes. Use `refreshExpired="auto"` to let the widget refresh expired tokens, or reset the widget yourself with the ref API.

### Programmatic Reset

```tsx
import { useRef } from "react";
import { Button } from "react-native";
import ReactNativeTurnstile from "react-native-turnstile-next";

import type { TurnstileRef } from "react-native-turnstile-next";

function TurnstileWidget() {
  const turnstileRef = useRef<TurnstileRef>(null);

  async function submitForm() {
    const result = await fetch("/path/to/some/api");

    if (!result.ok) {
      turnstileRef.current?.reset();
      throw new Error(`Request failed with code ${result.status}`);
    }
  }

  return (
    <>
      <ReactNativeTurnstile
        ref={turnstileRef}
        sitekey="xxxxxxxxxxxxxxxxxxx"
        onVerify={(token) => console.log(token)}
        onExpire={() => turnstileRef.current?.reset()}
      />
      <Button title="Submit" onPress={submitForm} />
    </>
  );
}
```

## Ref API

`ReactNativeTurnstile` exposes an imperative ref:

```tsx
import { useRef } from "react";
import { Button } from "react-native";
import ReactNativeTurnstile from "react-native-turnstile-next";

import type { TurnstileRef } from "react-native-turnstile-next";

function TurnstileWidget() {
  const turnstileRef = useRef<TurnstileRef>(null);

  return (
    <>
      <ReactNativeTurnstile
        ref={turnstileRef}
        sitekey="xxxxxxxxxxxxxxxxxxx"
        execution="execute"
        onVerify={(token) => console.log(token)}
      />
      <Button title="Execute" onPress={() => turnstileRef.current?.execute()} />
      <Button title="Reset" onPress={() => turnstileRef.current?.reset()} />
    </>
  );
}
```

`reset()` and `reload()` reload the internal `WebView`. `execute()` injects an execute request into the bridge page. For custom bridges, listen for the `react-native-turnstile:execute` browser event or expose `window.turnstile.execute()`.

The older `resetRef` prop and `resetTurnstile(resetRef)` helper are still available for compatibility.

## Error Handling

`onError` returns a structured `TurnstileError` object based on the [Cloudflare Turnstile error codes](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/):

```tsx
<ReactNativeTurnstile
  sitekey="xxxxxxxxxxxxxxxxxxx"
  onError={(error) => {
    console.log(error.errorCode);
    console.log(error.description);
    console.log(error.retry);
    console.log(error.troubleshooting);
    console.log(error.referenceUrl);
  }}
/>
```

Example:

```ts
{
  errorCode: 110200,
  description: "Domain not authorized",
  retry: false,
  troubleshooting: "Add current domain in Hostname Management.",
  raw: "110200",
  referenceUrl: "https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/"
}
```

Unknown errors return `errorCode: "unknown"` and include the same `referenceUrl` so users can inspect Cloudflare's latest documentation.

## Custom Bridge

By default, the package loads:

```txt
https://turnstile.1337707.xyz/turnstile
```

You can provide your own bridge host and path:

```tsx
<ReactNativeTurnstile
  sitekey="xxxxxxxxxxxxxxxxxxx"
  domain="captcha.example.com"
  path="/custom-turnstile"
/>
```

`domain` accepts both `captcha.example.com` and `https://captcha.example.com`. `path` accepts both `custom-turnstile` and `/custom-turnstile`.

## WebView Props

Use `webViewProps` to pass supported props to the internal `WebView`:

```tsx
<ReactNativeTurnstile
  sitekey="xxxxxxxxxxxxxxxxxxx"
  webViewProps={{
    cacheEnabled: false,
    incognito: true,
    userAgent: "MyApp",
  }}
/>
```

`source`, `onMessage`, and `ref` are controlled by this package and cannot be overridden through `webViewProps`.

## Documentation

`ReactNativeTurnstile` takes the following arguments:

| name              | required | type                                      | description                                    |
| ----------------- | -------- | ----------------------------------------- | ---------------------------------------------- |
| sitekey           | Yes      | `string`                                  | Sitekey of your Turnstile widget.              |
| domain            | No       | `string`                                  | Bridge domain or URL. Defaults to `https://turnstile.1337707.xyz`. |
| path              | No       | `string`                                  | Bridge path. Defaults to `/turnstile`.         |
| action            | No       | `string`                                  | Turnstile action value.                        |
| cData             | No       | `string`                                  | Custom data passed to Turnstile.               |
| theme             | No       | `"light" \| "dark" \| "auto"`            | Widget theme.                                  |
| language          | No       | `SupportedLanguages \| "auto"`           | Widget language.                               |
| size              | No       | `"compact" \| "normal"`                  | Widget size.                                   |
| fixedSize         | No       | `boolean`                                 | Whether the bridge should use fixed sizing.    |
| tabIndex          | No       | `number`                                  | Widget tab index.                              |
| responseField     | No       | `boolean`                                 | Controls generation of the response input.     |
| responseFieldName | No       | `string`                                  | Changes the response input name.               |
| retry             | No       | `"auto" \| "never"`                      | Retry behavior.                                |
| retryInterval     | No       | `number`                                  | Retry interval in milliseconds.                |
| refreshExpired    | No       | `"auto" \| "manual" \| "never"`          | Expired token refresh behavior.                |
| appearance        | No       | `"always" \| "execute" \| "interaction-only"` | Widget appearance behavior.             |
| execution         | No       | `"render" \| "execute"`                  | Widget execution behavior.                     |
| id                | No       | `string`                                  | ID of the widget container.                    |
| resetRef          | No       | `TurnstileResetRef`                       | Legacy ref in which the package injects `reset()`. |
| className         | No       | `string`                                  | Provided to facilitate NativeWind classes.     |
| style             | No       | `StyleProp<ViewStyle>`                    | Passed to the React Native `View` container.   |
| webViewProps      | No       | `TurnstileWebViewProps`                   | Additional props passed to the internal `WebView`. `source` and `onMessage` are controlled by this package. |

And the following callbacks:

| name                | required | arguments         | description                                  |
| ------------------- | -------- | ----------------- | -------------------------------------------- |
| onVerify            | No       | `token`           | Called when the challenge is passed.         |
| onLoad              | No       | `widgetId`        | Called when the widget is loaded.            |
| onError             | No       | `TurnstileError`  | Called when an error occurs.                 |
| onExpire            | No       | `token`           | Called when the token expires.               |
| onTimeout           | No       | -                 | Called when the challenge times out.         |
| onAfterInteractive  | No       | -                 | Called after the widget becomes interactive. |
| onBeforeInteractive | No       | -                 | Called before the widget becomes interactive. |
| onUnsupported       | No       | -                 | Called when the browser is unsupported.      |

For more details on what each argument does, see the [Cloudflare Documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations).

## Type Exports

The package exports these public types:

```ts
import type {
  ReactNativeTurnstileEvent,
  TurnstileCallbacks,
  TurnstileError,
  TurnstileErrorCode,
  TurnstileEvent,
  TurnstileProps,
  TurnstileRef,
  TurnstileResetRef,
  TurnstileWebViewProps,
} from "react-native-turnstile-next";
```

## Expo Example

An Expo example is available in `examples/expo`:

```sh
cd examples/expo
npm install
npm run ios
```

## Credits

This package is a fork of [`react-native-turnstile`](https://github.com/designly1/react-native-turnstile) by Jay Simons. It continues development under the `react-native-turnstile-next` package name with updated publishing metadata, TypeScript exports, custom bridge support, and additional React Native APIs.
