import { Breadcrumb, message } from 'antd';
import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PERFORMANCE_API } from '../core/api';
import { Bitwise, Dictionary } from '../core/interfaces';
import PortalLayoutContext from '../layouts/PortalLayout/context';
import { PortalSvc } from '../services/portal-svc';
import { SearchParams } from '../utils/history-utils';
import { createLogger } from '../utils/log-utils';
import { AsyncFn, AsyncOptions, useAsyncProvider, useCreation } from './use-advanced';

const portalErrorLogger = createLogger('portal-error');

export function usePortalErrorHandler(): [(err: any) => void] {
	const handleError = useCallback((err: any) => {
		// 用户登录问题
		if (PERFORMANCE_API.isUserNeedLoginError(err)) {
			window.location.href = PortalSvc.getLoginUrl(window.location.href);
			return;
		}

		portalErrorLogger.error(`${err.message || err}`, { err });
		message.error(`${err.message || err}`);
	}, []);

	return [handleError];
}

export function useRouterSearchParams(): [SearchParams] {
	const location = useLocation();
	const sp = useMemo(() => SearchParams.parse(location.search), [location.search]);
	return [sp];
}

export function useRouterSearchParamsSelective<T extends Dictionary<string | undefined>>(
	selector: (sp: SearchParams) => T,
): [T] {
	const [sp] = useRouterSearchParams();

	const params = useCreation<T>(
		(prev) => {
			const next = selector(sp);

			if (!prev) {
				return next;
			}

			const prevKeys = Object.keys(prev);
			const nextKeys = Object.keys(next);

			if (prevKeys.length !== nextKeys.length) {
				return next;
			}

			for (const key of prevKeys) {
				if (prev[key] !== next[key]) {
					return next;
				}
			}

			return prev;
		},
		[sp],
	);

	return [params];
}

export function usePortalAsyncProvider(
	state?: AsyncOptions<any, any>,
): <R = any, P extends any[] = any[]>(
	service: (...args: P) => Promise<R>,
	options?: AsyncOptions<R, P>,
) => AsyncFn<R, P> {
	const [handleError] = usePortalErrorHandler();
	return useAsyncProvider({ onError: handleError, ...state });
}

export function usePortalUserIsPermitted(): [(bw: Bitwise) => boolean] {
	const { userIsPermitted } = useContext(PortalLayoutContext);

	return useMemo(() => {
		const isPermitted = userIsPermitted || (() => false);
		return [isPermitted];
	}, [userIsPermitted]);
}

export function usePortalBreadcrumb(): [ReactNode] {
	const { breadcrumbData = [] } = useContext(PortalLayoutContext);

	const breadcrumb = useMemo((): ReactNode => {
		if (breadcrumbData.length <= 0) {
			return;
		}

		return (
			<Breadcrumb>
				{breadcrumbData.map((node, idx) => {
					if (idx === breadcrumbData.length - 1 || !node.attrs.path) {
						return <Breadcrumb.Item key={node.id}>{node.attrs.label}</Breadcrumb.Item>;
					} else {
						return (
							<Breadcrumb.Item key={node.id}>
								<Link to={node.attrs.path}>{node.attrs.label}</Link>
							</Breadcrumb.Item>
						);
					}
				})}
			</Breadcrumb>
		);
	}, [breadcrumbData]);

	return [breadcrumb];
}
