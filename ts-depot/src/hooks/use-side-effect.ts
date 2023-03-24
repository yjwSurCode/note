/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';
import { useMemoizedFn } from './use-advanced';

export function useComponentProps<K, T>(_defaults: K, _props: T): [K, Pick<T, Exclude<keyof T, keyof K>>] {
	const values: any = {};

	const props: any = { ..._props };
	const defaults: any = _defaults;

	for (const key in defaults) {
		values[key] = props[key] !== undefined ? props[key] : defaults[key];
		delete props[key];
	}

	return [values, props];
}

export function configComponentProps<K>(defaults: K): <T>(props: T) => [K, Pick<T, Exclude<keyof T, keyof K>>] {
	return (props) => useComponentProps(defaults, props);
}

export function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
	const lockRef = useRef(false);

	return useCallback(
		async (...args: P) => {
			if (lockRef.current) return;
			lockRef.current = true;
			try {
				const ret = await fn(...args);
				lockRef.current = false;
				return ret;
			} catch (e) {
				lockRef.current = false;
				throw e;
			}
		},
		[fn],
	);
}

export function useLockMemoizedFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
	fn = useMemoizedFn(fn);
	return useLockFn(fn);
}
