// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lifecycle from 'page-lifecycle';
import { RefObject, useEffect, useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Dictionary } from '../core/interfaces';
import { IS_BROWSER, raf } from '../utils/dom-utils';
import { debounce, throttle } from '../utils/function-utils';
import { useMemoizedFn } from './use-advanced';
import { useLatestRef } from './use-state';

// https://www.zhangxinxu.com/wordpress/2021/11/js-visibilitychange-pagehide-lifecycle/
interface PageStateEvent {
	oldState: 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated' | 'discarded';
	newState: 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated' | 'discarded';
}

export function usePageStateChange(cb: (e: PageStateEvent) => void) {
	cb = useMemoizedFn(cb);

	useEffect(() => {
		const handler = (e: any) => {
			cb({
				oldState: e.oldState,
				newState: e.newState,
			});
		};

		lifecycle.addEventListener('statechange', handler);

		return () => {
			lifecycle.removeEventListener('statechange', handler);
		};
	}, [cb]);
}

interface ElementDimension {
	width: number;
	height: number;
}

export function useWindowSize(options?: { initialDimension?: ElementDimension }): [ElementDimension] {
	const [windowSize, setWindowSize] = useState<ElementDimension>(() => {
		return {
			width: IS_BROWSER ? window.innerWidth : options?.initialDimension?.width || 0,
			height: IS_BROWSER ? window.innerHeight : options?.initialDimension?.height || 0,
		};
	});

	useEffect(() => {
		if (!IS_BROWSER) {
			return;
		}

		const onResize = () => {
			setWindowSize((prev) => {
				const width = window.innerWidth;
				const height = window.innerHeight;

				return prev.height === height && prev.width === width ? prev : { width, height };
			});
		};

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return [windowSize];
}

type ResponsiveInfo<T extends Dictionary<number>> = { [K in keyof T]: boolean };

export function configResponsive<T extends Dictionary<number>>(query: T): () => [ResponsiveInfo<T> | undefined] {
	const subscribers = new Set<() => void>();
	let info: ResponsiveInfo<T> | undefined;

	const calculate = () => {
		const width = window.innerWidth;
		const newInfo: any = {};

		let shouldUpdate = false;

		for (const key of Object.keys(query)) {
			newInfo[key] = width >= query[key];

			if (!info || newInfo[key] !== info[key]) {
				shouldUpdate = true;
			}
		}

		if (shouldUpdate) {
			info = newInfo;
		}
	};

	const init = () => {
		if (info || typeof window === 'undefined') return;

		calculate();

		const onResize = throttle(
			() => {
				const oldInfo = info;

				calculate();

				if (oldInfo === info) return;

				for (const subscriber of subscribers) {
					subscriber();
				}
			},
			60,
			{ leading: true, trailing: true },
		);

		window.addEventListener('resize', onResize);
	};

	return (): [ResponsiveInfo<T> | undefined] => {
		init();
		const windowExists = typeof window !== 'undefined';
		const [state, setState] = useState<ResponsiveInfo<T> | undefined>(info);

		useEffect(() => {
			if (!windowExists) {
				return;
			}

			const subscriber = () => {
				setState(info);
			};

			subscribers.add(subscriber);

			return () => {
				subscribers.delete(subscriber);
			};
		}, [windowExists]);

		return [state];
	};
}

export function useRefDimension<T extends Element>(
	nodeRef: RefObject<T>,
	options?: { initialDimension?: ElementDimension; delay?: number; effectDeps?: any[] },
): [ElementDimension] {
	const [dimension, setDimension] = useState<ElementDimension>(() => {
		return options?.initialDimension || { width: 0, height: 0 };
	});

	const delayRef = useLatestRef(options?.delay);

	useLayoutEffect(() => {
		const node = nodeRef.current;

		if (!node) {
			return;
		}

		const measure = () =>
			raf(() => {
				const newDimensions = node.getBoundingClientRect();
				setDimension(newDimensions);
			});

		// invoke measure right away
		measure();

		const debounceMeasure = debounce(measure, delayRef.current || 60);
		const resizeObserver = new ResizeObserver(debounceMeasure);
		resizeObserver.observe(node);

		return () => {
			resizeObserver.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayRef, nodeRef.current, ...(options?.effectDeps || [])]);

	return [dimension];
}
