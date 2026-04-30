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

type TurnstileBridgeProps = TurnstileQueryParams & Pick<TurnstileProps, 'domain' | 'path'>;

export function buildTurnstileSource(props: TurnstileBridgeProps) {
	if (shouldUseInlineBridge(props)) {
		return {
			html: buildTurnstileHtml(props),
			baseUrl: `${normalizeDomain(props.domain || PUBLIC_DOMAIN)}/`,
		};
	}

	return { uri: buildTurnstileUrl(props) };
}

export function buildTurnstileUrl(props: TurnstileQueryParams & Pick<TurnstileProps, 'domain' | 'path'>) {
	const bridgeDomain = normalizeDomain(props.domain || PUBLIC_DOMAIN);
	const bridgePath = normalizePath(props.path || PUBLIC_PATH);
	const params = buildTurnstileQueryParams(props);

	return `${bridgeDomain}${bridgePath}?${params.toString()}`;
}

export function shouldUseInlineBridge(props: Pick<TurnstileProps, 'domain' | 'path'>) {
	return Boolean(props.domain && props.path === undefined);
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

function buildTurnstileHtml(props: TurnstileQueryParams) {
	const containerId = props.id || 'turnstile-widget';
	const options = buildTurnstileRenderOptions(props);

	return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body {
      background: transparent;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      align-items: center;
      display: flex;
      justify-content: center;
    }
  </style>
  <script>
    window.__turnstileOptions = ${escapeScriptJson(options)};

    function postTurnstileEvent(event, data) {
      if (!window.ReactNativeWebView) {
        return;
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({ event: event, data: data }));
    }

    window.onTurnstileLoaded = function onTurnstileLoaded() {
      try {
        var container = document.getElementById(${escapeScriptJson(containerId)});
        var widgetId = window.turnstile.render(container, Object.assign({}, window.__turnstileOptions, {
          callback: function callback(token) {
            postTurnstileEvent('verify', token);
          },
          'error-callback': function errorCallback(errorCode) {
            postTurnstileEvent('error', errorCode);
          },
          'expired-callback': function expiredCallback(token) {
            postTurnstileEvent('expire', token);
          },
          'timeout-callback': function timeoutCallback() {
            postTurnstileEvent('timeout');
          },
          'after-interactive-callback': function afterInteractiveCallback() {
            postTurnstileEvent('afterInteractive');
          },
          'before-interactive-callback': function beforeInteractiveCallback() {
            postTurnstileEvent('beforeInteractive');
          },
          'unsupported-callback': function unsupportedCallback() {
            postTurnstileEvent('unsupported');
          }
        }));

        postTurnstileEvent('load', widgetId);
      } catch (error) {
        postTurnstileEvent('error', error && error.message ? error.message : String(error));
      }
    };
  </script>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoaded" async defer></script>
</head>
<body>
  <div id="${escapeHtmlAttribute(containerId)}"></div>
</body>
</html>`;
}

function buildTurnstileRenderOptions(props: TurnstileQueryParams) {
	const options: Record<string, string | number | boolean> = {
		sitekey: props.sitekey,
	};

	if (props.action) {
		options.action = props.action;
	}
	if (props.cData) {
		options.cData = props.cData;
	}
	if (props.theme) {
		options.theme = props.theme;
	}
	if (props.language) {
		options.language = props.language;
	}
	if (props.tabIndex !== undefined) {
		options.tabindex = props.tabIndex;
	}
	if (props.responseField !== undefined) {
		options['response-field'] = props.responseField;
	}
	if (props.responseFieldName) {
		options['response-field-name'] = props.responseFieldName;
	}
	if (props.size) {
		options.size = props.size;
	}
	if (props.retry) {
		options.retry = props.retry;
	}
	if (props.retryInterval !== undefined) {
		options['retry-interval'] = props.retryInterval;
	}
	if (props.refreshExpired) {
		options['refresh-expired'] = props.refreshExpired;
	}
	if (props.appearance) {
		options.appearance = props.appearance;
	}
	if (props.execution) {
		options.execution = props.execution;
	}

	return options;
}

function escapeScriptJson(value: unknown) {
	return JSON.stringify(value)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

function escapeHtmlAttribute(value: string) {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
