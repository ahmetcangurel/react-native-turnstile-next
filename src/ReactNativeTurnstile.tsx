import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { TURNSTILE_DIMENSIONS } from './constants';
import { useTurnstileControls } from './hooks/useTurnstileControls';
import { getTurnstileError } from './utils/errors';
import { buildTurnstileUrl } from './utils/url';

import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNativeTurnstileEvent, TurnstileProps, TurnstileRef, TurnstileResetRef } from './types';

const ReactNativeTurnstile = React.forwardRef<TurnstileRef, TurnstileProps>((props, ref) => {
	const {
		onVerify,
		onLoad,
		onError,
		onExpire,
		onTimeout,
		onAfterInteractive,
		onBeforeInteractive,
		onUnsupported,
		size,
		resetRef,
		style,
		webViewProps,
	} = props;

	const webviewRef = React.useRef<WebView>(null);

	useTurnstileControls(webviewRef, ref, resetRef);

	const url = buildTurnstileUrl(props);
	const dimensions = TURNSTILE_DIMENSIONS[size || 'normal'];

	const computedStyles: StyleProp<ViewStyle> = StyleSheet.flatten([
		{ height: dimensions.height, width: dimensions.width },
		style,
	]);

	return (
		<View style={computedStyles}>
			<WebView
				{...webViewProps}
				ref={webviewRef}
				source={{ uri: url }}
				onMessage={event => {
					try {
						const eventData = JSON.parse(event.nativeEvent.data) as ReactNativeTurnstileEvent;
						if (!eventData.event) {
							throw new Error('Invalid event received from Turnstile endpoint');
						}

						switch (eventData.event) {
							case 'verify':
								if (onVerify && eventData.data) {
									onVerify(eventData.data);
								}
								break;
							case 'load':
								if (onLoad && eventData.data) {
									onLoad(eventData.data);
								}
								break;
							case 'error':
								if (onError) {
									onError(getTurnstileError(eventData.data));
								}
								break;
							case 'expire':
								if (onExpire && eventData.data) {
									onExpire(eventData.data);
								}
								break;
							case 'timeout':
								if (onTimeout) {
									onTimeout();
								}
								break;
							case 'afterInteractive':
								if (onAfterInteractive) {
									onAfterInteractive();
								}
								break;
							case 'beforeInteractive':
								if (onBeforeInteractive) {
									onBeforeInteractive();
								}
								break;
							case 'unsupported':
								if (onUnsupported) {
									onUnsupported();
								}
								break;
							default:
								console.error(
									'Unsupported event received from Turnstile endpoint:',
									eventData.event,
								);
						}
					} catch (e) {
						console.error('Error parsing event data:', e);
					}
				}}
				javaScriptEnabled={webViewProps?.javaScriptEnabled ?? true}
				style={StyleSheet.flatten([styles.webview, webViewProps?.style])}
				originWhitelist={webViewProps?.originWhitelist ?? ['*']}
			/>
		</View>
	);
});

ReactNativeTurnstile.displayName = 'ReactNativeTurnstile';

const styles = StyleSheet.create({
	webview: {
		flex: 1,
	},
});

export function resetTurnstile(ref: TurnstileResetRef) {
	if (ref.current && typeof ref.current === 'function') {
		ref.current();
	}
}

export default ReactNativeTurnstile;
