import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { depsAreSame } from '../utils/react-utils';
import { useUnmountedRef, useUpdateEffect } from './use-life-cycle';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T {
	const fnRef = useRef<T>(fn);

	// why not write `fnRef.current = fn`?
	// https://github.com/alibaba/hooks/issues/728
	fnRef.current = useMemo(() => fn, [fn]);

	const memoizedFn = useRef<T>();

	if (!memoizedFn.current) {
		memoizedFn.current = function (...args) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return fnRef.current?.apply(this, args);
		} as T;
	}

	return memoizedFn.current;
}

export interface AsyncState<R> {
	loading: boolean;
	error?: Error;
	data?: R;
}

export type AsyncFn<R, P extends any[]> = [
	AsyncState<R>,
	{
		run: (...args: P) => Promise<R>;
		mutate: (data: R | undefined | ((prevData: R | undefined) => R | undefined)) => void;
	},
];

export interface AsyncOptions<R, P extends any[]> {
	initialState?: AsyncState<R> | (() => AsyncState<R>);
	cacheData?: boolean;
	onSuccess?: (data: R, params: P) => void;
	onError?: (e: Error, params: P) => void;
}

async function sleep(timeoutsMs: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, timeoutsMs);
	});
}

export function useAsync<R = any, P extends any[] = any[]>(
	service: (...args: P) => Promise<R>,
	options: AsyncOptions<R, P> = {},
): AsyncFn<R, P> {
	const lastCallId = useRef(0);
	const [state, setState] = useState<AsyncState<R>>(options.initialState || (() => ({ loading: false })));

	const unmountedRef = useUnmountedRef();
	const onSuccess = useMemoizedFn(options.onSuccess || noop);
	const onError = useMemoizedFn(options.onError || noop);
	service = useMemoizedFn(service);

	const run = useMemoizedFn(async (...args: P): Promise<R> => {
		const cacheData = options.cacheData;
		const callId = ++lastCallId.current;

		if (cacheData) {
			setState((prev) => ({ data: prev.data, loading: true }));
		} else {
			setState({ loading: true });
		}

		return sleep(0).then(() =>
			service(...args).then(
				(data) => {
					if (!unmountedRef.current && callId === lastCallId.current) {
						setState({ data, loading: false });
						onSuccess(data, args);
					}

					return data;
				},
				(error) => {
					if (!unmountedRef.current && callId === lastCallId.current) {
						setState({ error, loading: false });
						onError(error, args);
					}

					return error;
				},
			),
		);
	});

	const mutate = useCallback((data: any): void => {
		if (typeof data === 'function') {
			setState((preState) => ({
				...preState,
				data: data(preState.data),
			}));
		} else {
			setState((preState) => {
				return { ...preState, data };
			});
		}
	}, []);

	return [state, { run, mutate }];
}

export function useAsyncProvider(
	state: AsyncOptions<any, any>,
): <R = any, P extends any[] = any[]>(
	service: (...args: P) => Promise<R>,
	options?: AsyncOptions<R, P>,
) => AsyncFn<R, P> {
	return (service, options) =>
		(useAsync as any)(service, {
			...state,
			...options,
		});
}

export function useCreationRef<T>(factory: (prev: T | undefined) => T, deps: any[]): MutableRefObject<T> {
	const depsRef = useRef(deps);
	const initializedRef = useRef(false);
	const objRef = useRef<T | undefined>(undefined);

	if (initializedRef.current === false || !depsAreSame(depsRef.current, deps)) {
		depsRef.current = deps;
		objRef.current = factory(objRef.current);
		initializedRef.current = true;
	}

	return objRef as any;
}

export function useCreation<T>(factory: (prev: T | undefined) => T, deps: any[]): T {
	return useCreationRef(factory, deps).current;
}

interface ControlledOptions<T> {
	value?: T;
	defaultValue: T | (() => T);
	onChange?: (...args: any[]) => void;
}

interface ControlledState<R> {
	controlled: boolean;
	value: R;
	onChange: (v: R) => void;
}

export function useControlledState<T, R = T>({
	defaultValue,
	value,
	onChange: _onChange,
}: ControlledOptions<T>): ControlledState<R> {
	const [innerValue, setInnerValue] = useState<T>(() => {
		if (value !== undefined) {
			return value;
		}

		return typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue;
	});

	const controlled = value !== undefined;
	const mergedValue = controlled ? value : innerValue;

	useUpdateEffect(() => {
		if (value !== undefined) {
			setInnerValue(value);
		}
	}, [value]);

	const onChange = useMemoizedFn((...args: any[]) => {
		if (!controlled) {
			setInnerValue(args[0]);
		}

		if (_onChange) {
			_onChange(...args);
		}
	});

	return {
		controlled,
		value: mergedValue as any,
		onChange,
	};
}

export type IProps = Record<string, any>;

export default function useWhyDidYouUpdate(componentName: string, props: IProps) {
	const prevProps = useRef<IProps>({});

	useEffect(() => {
		if (prevProps.current) {
			const allKeys = Object.keys({ ...prevProps.current, ...props });
			const changedProps: IProps = {};

			allKeys.forEach((key) => {
				if (!Object.is(prevProps.current[key], props[key])) {
					changedProps[key] = {
						from: prevProps.current[key],
						to: props[key],
					};
				}
			});

			if (Object.keys(changedProps).length) {
				console.log('[why-did-you-update]', componentName, changedProps);
			}
		}

		prevProps.current = props;
	});
}
