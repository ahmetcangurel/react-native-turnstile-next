import type { TurnstileError, TurnstileErrorCode } from '../types';

export const TURNSTILE_ERROR_CODES_REFERENCE_URL =
	'https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/';

const TURNSTILE_ERROR_DETAILS: Record<
	Exclude<TurnstileErrorCode, 'unknown'>,
	Omit<TurnstileError, 'errorCode' | 'raw' | 'referenceUrl'>
> = {
	110100: {
		description: 'Invalid sitekey',
		retry: false,
		troubleshooting: 'Verify the sitekey in Cloudflare dashboard.',
	},
	110110: {
		description: 'Sitekey not found',
		retry: false,
		troubleshooting: 'Check sitekey spelling and dashboard configuration.',
	},
	110200: {
		description: 'Domain not authorized',
		retry: false,
		troubleshooting: 'Add current domain in Hostname Management.',
	},
	110600: {
		description: 'Challenge timed out',
		retry: true,
		troubleshooting: "The visitor's clock may be wrong, or the challenge took too long.",
	},
	110620: {
		description: 'Interaction timed out',
		retry: true,
		troubleshooting: 'The visitor did not interact with the widget in time. Reset with turnstile.reset().',
	},
	200100: {
		description: 'Clock or cache problem',
		retry: false,
		troubleshooting: "The visitor's clock is wrong or the challenge was cached by an intermediary.",
	},
	200500: {
		description: 'Iframe load error',
		retry: true,
		troubleshooting: 'The Turnstile iframe could not load. Check if challenges.cloudflare.com is blocked.',
	},
	'300*': {
		description: 'Generic challenge failure',
		retry: true,
		troubleshooting: 'Bot behavior detected. Refer to Cloudflare Turnstile troubleshooting.',
	},
	400020: {
		description: 'Invalid sitekey',
		retry: false,
		troubleshooting: 'Verify the sitekey in Cloudflare dashboard.',
	},
	400070: {
		description: 'Sitekey disabled',
		retry: false,
		troubleshooting: 'The sitekey is disabled. Check the Cloudflare dashboard.',
	},
	'600*': {
		description: 'Generic challenge failure',
		retry: true,
		troubleshooting: 'Bot behavior detected. Refer to Cloudflare Turnstile troubleshooting.',
	},
	401: {
		description: 'Unauthorized Private Access Token request',
		retry: false,
		troubleshooting:
			'This can be an expected part of the Challenge Platform workflow. If a token is received, no action is required.',
	},
};

export function getTurnstileError(raw?: string): TurnstileError {
	const errorCode = parseTurnstileErrorCode(raw);

	if (errorCode !== 'unknown') {
		const details = TURNSTILE_ERROR_DETAILS[errorCode];

		return {
			errorCode,
			...details,
			raw,
			referenceUrl: TURNSTILE_ERROR_CODES_REFERENCE_URL,
		};
	}

	return {
		errorCode: 'unknown',
		description: 'Unknown Turnstile error',
		retry: false,
		troubleshooting: 'Check the raw error and Cloudflare Turnstile error codes documentation.',
		raw,
		referenceUrl: TURNSTILE_ERROR_CODES_REFERENCE_URL,
	};
}

function parseTurnstileErrorCode(raw?: string): TurnstileErrorCode {
	if (!raw) {
		return 'unknown';
	}

	const exactCode = raw.match(/\b\d{3,6}\b/)?.[0];

	if (!exactCode) {
		return 'unknown';
	}

	if (exactCode.startsWith('300')) {
		return '300*';
	}
	if (exactCode.startsWith('600')) {
		return '600*';
	}

	const numericCode = Number(exactCode) as TurnstileErrorCode;

	return numericCode in TURNSTILE_ERROR_DETAILS ? numericCode : 'unknown';
}
