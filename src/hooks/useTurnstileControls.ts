import * as React from 'react';

import type { WebView } from 'react-native-webview';
import type { TurnstileRef, TurnstileResetRef } from '../types';

const EXECUTE_SCRIPT = `
(() => {
  window.dispatchEvent(new CustomEvent('react-native-turnstile:execute'));

  if (window.turnstile && typeof window.turnstile.execute === 'function') {
    window.turnstile.execute();
  }
})();
true;
`;

export function useTurnstileControls(
	webviewRef: React.RefObject<WebView>,
	ref: React.ForwardedRef<TurnstileRef>,
	resetRef?: TurnstileResetRef,
) {
	const reload = React.useCallback(() => {
		if (webviewRef.current) {
			webviewRef.current.reload();
		}
	}, [webviewRef]);

	const execute = React.useCallback(() => {
		if (webviewRef.current) {
			webviewRef.current.injectJavaScript(EXECUTE_SCRIPT);
		}
	}, [webviewRef]);

	React.useImperativeHandle(
		ref,
		() => ({
			reset: reload,
			reload,
			execute,
		}),
		[execute, reload],
	);

	React.useEffect(() => {
		if (resetRef) {
			resetRef.current = reload;
		}
	}, [reload, resetRef]);
}
