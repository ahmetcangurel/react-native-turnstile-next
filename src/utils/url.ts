import { PUBLIC_DOMAIN, PUBLIC_PATH } from '../constants';

import type { TurnstileProps } from '../types';

type TurnstileQueryParams = Pick<
	TurnstileProps,
	| 'sitekey'
	| 'action'
	| 'cData'
	| 'theme'
	| 'language'
	| 'tabIndex'
	| 'responseField'
	| 'responseFieldName'
	| 'size'
	| 'fixedSize'
	| 'retry'
	| 'retryInterval'
	| 'refreshExpired'
	| 'appearance'
	| 'execution'
	| 'id'
>;

export function buildTurnstileUrl(props: TurnstileQueryParams & Pick<TurnstileProps, 'domain' | 'path'>) {
	const bridgeDomain = normalizeDomain(props.domain || PUBLIC_DOMAIN);
	const bridgePath = normalizePath(props.path || PUBLIC_PATH);
	const params = buildTurnstileQueryParams(props);

	return `${bridgeDomain}${bridgePath}?${params.toString()}`;
}

export function normalizeDomain(domain: string) {
	const domainWithProtocol = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;

	return domainWithProtocol.replace(/\/+$/, '');
}

export function normalizePath(path: string) {
	const pathWithoutTrailingSlash = path.replace(/^\/?/, '/').replace(/\/+$/, '');

	return pathWithoutTrailingSlash || '/';
}

function buildTurnstileQueryParams(props: TurnstileQueryParams) {
	const params = new URLSearchParams();

	if (props.sitekey) {
		params.append('sitekey', props.sitekey);
	}
	if (props.action) {
		params.append('action', props.action);
	}
	if (props.cData) {
		params.append('cData', props.cData);
	}
	if (props.theme) {
		params.append('theme', props.theme);
	}
	if (props.language) {
		params.append('language', props.language);
	}
	if (props.tabIndex !== undefined) {
		params.append('tabIndex', props.tabIndex.toString());
	}
	if (props.responseField !== undefined) {
		params.append('responseField', props.responseField.toString());
	}
	if (props.responseFieldName) {
		params.append('responseFieldName', props.responseFieldName);
	}
	if (props.size) {
		params.append('size', props.size);
	}
	if (props.fixedSize !== undefined) {
		params.append('fixedSize', props.fixedSize.toString());
	}
	if (props.retry) {
		params.append('retry', props.retry);
	}
	if (props.retryInterval !== undefined) {
		params.append('retryInterval', props.retryInterval.toString());
	}
	if (props.refreshExpired) {
		params.append('refreshExpired', props.refreshExpired);
	}
	if (props.appearance) {
		params.append('appearance', props.appearance);
	}
	if (props.execution) {
		params.append('execution', props.execution);
	}
	if (props.id) {
		params.append('id', props.id);
	}

	return params;
}
