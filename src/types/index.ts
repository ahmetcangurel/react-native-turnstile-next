import * as React from 'react';

import type { SupportedLanguages } from 'turnstile-types';
import type { StyleProp, ViewStyle } from 'react-native';
import type { WebViewProps } from 'react-native-webview';

export interface TurnstileProps extends TurnstileCallbacks {
	/**
	 * Cloudflare Turnstile sitekey.
	 */
	sitekey: string;

	/**
	 * Bridge domain or full URL used as the internal WebView origin.
	 */
	domain: string;

	/**
	 * Customer value used to differentiate widgets under the same sitekey in analytics.
	 */
	action?: string;

	/**
	 * Custom payload passed to Turnstile and returned during server-side validation.
	 */
	cData?: string;

	/**
	 * Widget theme.
	 */
	theme?: 'light' | 'dark' | 'auto';

	/**
	 * Widget language. Use `auto` to let Turnstile detect the language.
	 */
	language?: SupportedLanguages | 'auto';

	/**
	 * Tab index of the Turnstile iframe for accessibility.
	 */
	tabIndex?: number;

	/**
	 * Controls whether Turnstile creates a response input field in the bridge page.
	 */
	responseField?: boolean;

	/**
	 * Name of the generated response input field.
	 */
	responseFieldName?: string;

	/**
	 * Widget size.
	 */
	size?: 'normal' | 'compact';

	/**
	 * Requests fixed bridge sizing when supported by the bridge page.
	 */
	fixedSize?: boolean;

	/**
	 * Retry behavior when Turnstile fails to obtain a token.
	 */
	retry?: 'auto' | 'never';

	/**
	 * Time between retry attempts in milliseconds.
	 */
	retryInterval?: number;

	/**
	 * Controls what happens when the token expires.
	 */
	refreshExpired?: 'auto' | 'manual' | 'never';

	/**
	 * Controls when the widget is visible.
	 */
	appearance?: 'always' | 'execute' | 'interaction-only';

	/**
	 * Controls when Turnstile obtains a token.
	 */
	execution?: 'render' | 'execute';

	/**
	 * ID assigned to the Turnstile widget container in the bridge page.
	 */
	id?: string;

	/**
	 * Legacy reset ref. Prefer the imperative component ref API for new code.
	 */
	resetRef?: TurnstileResetRef;

	/**
	 * Optional class name forwarded to the React Native container for NativeWind-style usage.
	 */
	className?: string;

	/**
	 * Style applied to the outer React Native `View` container.
	 */
	style?: StyleProp<ViewStyle>;

	/**
	 * Additional props passed to the internal `WebView`.
	 * `source`, `onMessage`, and `ref` are controlled by this package.
	 */
	webViewProps?: TurnstileWebViewProps;
}

export interface TurnstileCallbacks {
	/**
	 * Called when Turnstile returns a verification token.
	 */
	onVerify?: (token: string) => void;

	/**
	 * Called when the widget is loaded and returns its widget ID.
	 */
	onLoad?: (widgetId: string) => void;

	/**
	 * Called when Turnstile returns an error. The error is mapped to Cloudflare's documented error codes when possible.
	 */
	onError?: (error: TurnstileError) => void;

	/**
	 * Called when the verification token expires.
	 */
	onExpire?: (token: string) => void;

	/**
	 * Called when the challenge times out.
	 */
	onTimeout?: () => void;

	/**
	 * Called after the challenge leaves interactive mode.
	 */
	onAfterInteractive?: () => void;

	/**
	 * Called before the challenge enters interactive mode.
	 */
	onBeforeInteractive?: () => void;

	/**
	 * Called when the current browser/WebView environment is unsupported by Turnstile.
	 */
	onUnsupported?: () => void;
}

/**
 * Event names emitted by the Turnstile bridge page.
 */
export type TurnstileEvent =
	| 'verify'
	| 'load'
	| 'error'
	| 'expire'
	| 'timeout'
	| 'afterInteractive'
	| 'beforeInteractive'
	| 'unsupported';

/**
 * Raw event payload posted from the bridge page to React Native.
 */
export interface ReactNativeTurnstleEvent {
	/**
	 * Event name emitted by the bridge page.
	 */
	event: TurnstileEvent;

	/**
	 * Optional event payload such as token, widget ID, or raw error code.
	 */
	data?: string;
}

export type ReactNativeTurnstileEvent = ReactNativeTurnstleEvent;

/**
 * Imperative API exposed by `ReactNativeTurnstile` via `ref`.
 */
export interface TurnstileRef {
	/**
	 * Reloads the internal WebView and resets the widget state.
	 */
	reset: () => void;

	/**
	 * Reloads the internal WebView.
	 */
	reload: () => void;

	/**
	 * Requests Turnstile execution inside the bridge page.
	 */
	execute: () => void;
}

/**
 * Known Cloudflare Turnstile error codes supported by this package.
 */
export type TurnstileErrorCode =
	| 110100
	| 110110
	| 110200
	| 110600
	| 110620
	| 200100
	| 200500
	| '300*'
	| 400020
	| 400070
	| '600*'
	| 401
	| 'unknown';

/**
 * Structured Turnstile error mapped from Cloudflare client-side error codes.
 */
export interface TurnstileError {
	/**
	 * Known Cloudflare error code, wildcard group, or `unknown`.
	 */
	errorCode: TurnstileErrorCode;

	/**
	 * Human-readable error description.
	 */
	description: string;

	/**
	 * Whether retrying the challenge is recommended.
	 */
	retry: boolean;

	/**
	 * Suggested troubleshooting action.
	 */
	troubleshooting: string;

	/**
	 * Raw error payload received from the bridge page.
	 */
	raw?: string;

	/**
	 * Cloudflare documentation URL for client-side Turnstile errors.
	 */
	referenceUrl: string;
}

/**
 * Legacy reset ref shape used by `resetRef` and `resetTurnstile`.
 */
export type TurnstileResetRef = React.MutableRefObject<() => void | undefined>;

/**
 * Props forwarded to the internal `WebView`.
 * `source`, `onMessage`, and `ref` are intentionally owned by this package.
 */
export type TurnstileWebViewProps = Omit<WebViewProps, 'source' | 'onMessage' | 'ref'>;
