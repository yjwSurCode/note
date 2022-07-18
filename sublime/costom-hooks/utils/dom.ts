import { MutableRefObject, LegacyRef } from 'react';

export type BasicTarget<T = HTMLElement> =
	| (() => T | null)
	| T
	| null
	| MutableRefObject<T | null | undefined>;
// | LegacyRef<T | null | undefined>;

type TargetElement = HTMLElement | Element | Document | Window;

export function getTargetElement(
	target?: BasicTarget<TargetElement>,
	defaultElement?: TargetElement,
): TargetElement | undefined | null {
	if (!target) {
		return defaultElement;
	}

	let targetElement: TargetElement | undefined | null;

	if (typeof target === 'function') {
		targetElement = target();
	} else if ('current' in target) {
		targetElement = target.current;
	} else {
		targetElement = target;
	}

	return targetElement;
}

/** 空方法 */
export function noop(): void {
	// empty
}

export function getElementRect(el: Element | Window): DOMRect {
	if (el === window) {
		const width = el.innerWidth;
		const height = el.innerHeight;

		return {
			top: 0,
			left: 0,
			right: width,
			bottom: height,
			width,
			height,
		} as DOMRect;
	} else {
		const element: Element = el as any;

		return element.getBoundingClientRect();
	}
}

//ResizeObserver
// useEffect(() => {
// 	const noticeBar = noticeBaRef.current;
// 	const contentElement = contentRef.current;
// 	const wrapperElement = wrapperRef.current;

// 	let observer: ResizeObserver | undefined;

// 	if (noticeBar) {
// 		observer = new ResizeObserver(() => {
// 			if (!contentElement || !wrapperElement) {
// 				return;
// 			}

// 			(stateRef.current.wrapperWidth =
// 				getElementRect(wrapperElement).width),
// 				(stateRef.current.contentWidth =
// 					getElementRect(contentElement).width);
// 		});

// 		observer.observe(noticeBar);
// 	}

// 	return () => {
// 		observer && observer.disconnect();
// 	};
// }, []);
