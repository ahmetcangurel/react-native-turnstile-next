import { Options } from 'tsup';
export const tsup: Options = {
	target: 'esnext',
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	keepNames: true,
	minify: true,
	sourcemap: true,
	format: ['cjs', 'esm'],
	external: ['react', 'react-native', 'react-native-webview'],
	banner: {
		js: `// react-native-turnstile-next`,
	},
};
