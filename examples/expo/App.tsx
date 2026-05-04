import { useRef, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ReactNativeTurnstile from 'react-native-turnstile-next';

import type { TurnstileRef } from 'react-native-turnstile-next';

const SITE_KEY = '1x00000000000000000000AA';
const TURNSTILE_DOMAIN = 'turnstile.1337707.xyz';

export default function App() {
	const turnstileRef = useRef<TurnstileRef>(null);
	const [token, setToken] = useState('');

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.content}>
				<Text style={styles.title}>React Native Turnstile Next</Text>
				<ReactNativeTurnstile
					ref={turnstileRef}
					sitekey={SITE_KEY}
					domain={TURNSTILE_DOMAIN}
					execution="execute"
					onVerify={setToken}
					onError={error => console.warn(error)}
					style={styles.widget}
					webViewProps={{
						cacheEnabled: false,
						originWhitelist: ['*'],
					}}
				/>
				<Button title="Execute" onPress={() => turnstileRef.current?.execute()} />
				<Button title="Reset" onPress={() => turnstileRef.current?.reset()} />
				<Text style={styles.token} numberOfLines={4}>
					{token || 'Token will appear here.'}
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
		padding: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
	},
	widget: {
		alignSelf: 'center',
	},
	token: {
		color: '#444',
		textAlign: 'center',
	},
});
