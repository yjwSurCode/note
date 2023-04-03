/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  EffectCallback,
  MutableRefObject,
  DependencyList,
} from 'react';
import {
  BasicTarget,
  getTargetElement,
  noop,
  getElementRect,
} from './utils/dom';
export type Dictionary<T = any> = { [key: string]: T };

//111111111111
// usePersistFn
export function usePersistFn<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering.');
  });

  ref.current = fn;

  const persistFn = useCallback(((...args) => ref.current(...args)) as T, [
    ref,
  ]);

  return persistFn;
}

// 22222222222:
// useClickAway
// 鼠标点击事件，click 不会监听右键
const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

export function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = defaultEvent
) {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const handler = (event: any) => {
      const targets = Array.isArray(target) ? target : [target];
      if (
        targets.some((targetItem) => {
          const targetElement = getTargetElement(targetItem) as HTMLElement;
          return !targetElement || targetElement?.contains(event.target);
        })
      ) {
        return;
      }
      onClickAwayRef.current(event);
    };

    document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }, [target, eventName]);
}

// 33333333333333
//eventBus
export function eventBus() {
  const all: Dictionary<Array<any>> = Object.create(null);

  return {
    /**
     * Register an event handler for the given type.
     *
     * @param type	Type of event to listen for, or `"*"` for all events
     * @param handler Function to call in response to given event
     */
    on(type: string, handler: (event?: any) => void) {
      (all[type] || (all[type] = [])).push(handler);
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param type	Type of event to unregister `handler` from, or `"*"`
     * @param handler Handler function to remove
     */
    off(type: string, handler: (event?: any) => void) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param type  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     */
    emit(type: string, evt: any) {
      (all[type] || []).slice().map((handler) => {
        handler(evt);
      });
      (all['*'] || []).slice().map((handler) => {
        handler(type, evt);
      });
    },
  };
}

// 44444444444444
// usePrevious
export type compareFunction<T> = (prev: T | undefined, next: T) => boolean;

export function usePrevious<T>(
  state: T,
  compare?: compareFunction<T>
): T | undefined {
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  const needUpdate =
    typeof compare === 'function' ? compare(curRef.current, state) : true;

  if (needUpdate) {
    console.log(prevRef.current, 'prevRef.current ');
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}

//55555555555555
// useMountedState
export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return get;
}

//66666666666666666666  !improtant
// useAsyncFn
export interface AsyncState<R> {
  loading: boolean;
  error?: Error;
  data?: R;
}

type AsyncFn<R, P extends any[]> = [
  AsyncState<R>,
  {
    run: (...args: P) => Promise<R>;
    mutate: (data: R | ((prevData: R | undefined) => R | undefined)) => void;
  }
];

interface AsyncOptions<R, P extends any[]> {
  initialState?: AsyncState<R> | (() => AsyncState<R>);
  cacheData?: boolean;
  onSuccess?: (data: R, params: P) => void;
  onError?: (e: Error, params: P) => void;
}

export function useAsyncFn<R = any, P extends any[] = any[]>(
  service: (...arg: P) => Promise<R>, //第一个参数 是一个箭头函数 不可以自加一个返回number
  options: AsyncOptions<R, P> = {} //是一个对象 ---{ onSuccess:res=>{}, onError:res=>{} }
): AsyncFn<R, P> {
  const lastCallId = useRef(0);
  const [state, setState] = useState<AsyncState<R>>(
    options.initialState || (() => ({ loading: false }))
  );

  const isMounted = useMountedState();
  console.log('1111111', isMounted());
  const onSuccess = usePersistFn(options.onSuccess || noop);
  const onError = usePersistFn(options.onError || noop);

  service = usePersistFn(service);

  const run = usePersistFn(async (...args: P): Promise<R> => {
    console.log('222222222');
    const cacheData = options.cacheData;
    const callId = ++lastCallId.current;

    if (cacheData) {
      console.log(state, 'state');
      setState((prev) => ({ data: prev.data, loading: true }));
    } else {
      setState({ loading: true }); //覆盖
    }

    return service(...args).then(
      (data) => {
        console.log(data, '444444444');
        if (isMounted() && callId === lastCallId.current) {
          setState({ data, loading: false });
          onSuccess(data, args);
        }

        return data;
      },
      (error) => {
        if (isMounted() && callId === lastCallId.current) {
          setState({ error, loading: false });
          onError(error, args);
        }

        return error;
      }
    );
  });
  const mutate: any = useCallback(
    (data: R | ((prevData: R | undefined) => R)): void => {
      if (typeof data === 'function') {
        setState((preState) => ({
          ...preState,
          data: (data as any)(preState.data),
        }));
      } else {
        console.log(data, 'mutate-data');
        setState((preState) => ({ ...preState, data }));
      }
    },
    []
  );

  return [state, { run, mutate }];
}

//777777777777777 useMount
/**
 * 只在组件 mount 时执行的 hook
 *
 * 示例：https://hooks.umijs.org/zh-CN/hooks/life-cycle/use-mount
 */
export function useMount(fn: any): void {
  // 持久化函数
  const fnPersist = usePersistFn(fn);

  useEffect(() => {
    if (fnPersist && typeof fnPersist === 'function') {
      fnPersist();
    }
  }, [fnPersist]);
}

//  useUnmount 只在组件 unmount 时执行的 hook
const useUnmount = (fn: any) => {
  const fnPersist = usePersistFn(fn);

  useEffect(
    () => () => {
      if (typeof fnPersist === 'function') {
        fnPersist();
      }
    },
    [fnPersist]
  );
};
export default useUnmount;

//88888888888888888
/**
 * 强制组件重新渲染的 hook

 //  * title.zh-CN: 防止重复提交
//  * desc.zh-CN: 在 `submit` 函数执行完成前，其余的点击动作都会被忽略。
 *
 * 示例：https://hooks.umijs.org/zh-CN/hooks/life-cycle/use-update
 useDidShow 是 Taro 专有的 Hook，等同于 componentDidShow 页面生命周期钩子
 useDidHide 是 Taro 专有的 Hook，等同于 componentDidHide 页面生命周期钩子
 usePullDownRefresh 是 Taro 专有的 Hook，等同于 onPullDownRefresh 页面生命周期钩子
 useReachBottom 是 Taro 专有的 Hook，等同于 onReachBottom 页面生命周期钩子
 useTabItemTap 是 Taro 专有的 Hook，等同于 onTabItemTap 页面生命周期钩子
 const router = useRouter();
 */

export function useUpdate(): () => void {
  console.log('useUpdate-');
  const [, setState] = useState(1);
  // const [, forceUpdate] = useReducer(
  // 	(val) => (val + 1) % (Number.MAX_SAFE_INTEGER - 1),
  // 	0,
  // );
  return useCallback(() => {
    setState((val) => (val + 1) % (Number.MAX_SAFE_INTEGER - 1));
    // forceUpdate();
  }, []);
}

//9999999999999999999
/**
 * 只在组件 destroy 时执行的 hook
 *
 * 示例：https://hooks.umijs.org/zh-CN/hooks/life-cycle/use-unmount
 */
export function useDestroy(fn: any): void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      if (fnRef.current && typeof fnRef.current === 'function') {
        fnRef.current();
      }
    };
  }, []);
}

// 10 10 10 10 10

/**
 * 使用上与 `useEffect` 完全相同，只是它忽略了首次渲染，且只在依赖项更新时运行。
 *
 * 示例：https://hooks.umijs.org/zh-CN/hooks/life-cycle/use-update-effect
 *
 */
export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// 11 11 11 11 11 11 11
/**
 * 使用上与 `useLayoutEffect` 完全相同，只是它忽略了首次渲染，且只在依赖项更新时运行。
 *
 * 示例：https://hooks.umijs.org/zh-CN/hooks/life-cycle/use-update-layout-effect
 *
 */
export function useUpdateLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// 12 12 12 12 12 12 12 useDebounceFn
// 去抖动 防抖动
// 如果在200ms内没有再次触发滚动事件，那么就执行函数
// 如果在200ms内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的200ms执行

type ReturnValue<T extends any[]> = [
  (...args: T) => void,
  { cancel: () => void }
];
export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number
): ReturnValue<T>;
export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  deps: DependencyList,
  wait: number
): ReturnValue<T>;
//前面为什么要这样写！

export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any, //更改函数
  deps: DependencyList | number, //[值]
  wait?: number //时间
): ReturnValue<T> {
  const _deps: DependencyList = (
    Array.isArray(deps) ? deps : []
  ) as DependencyList;

  const _wait: number = typeof deps === 'number' ? deps : wait || 0;
  const timer = useRef<any>();
  const fnRef = useRef<(...arg: any[]) => any>(fn);
  fnRef.current = fn;

  const currentArgs = useRef<any>([]); //节流

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined; //节流
  }, []);

  const run = useCallback(
    (...args: any) => {
      // cancel();
      // timer.current = setTimeout(() => {
      // 	fnRef.current(...args);
      // }, _wait);
      console.log(args, 'args');
      currentArgs.current = args;
      if (!timer.current) {
        timer.current = setTimeout(() => {
          // fnRef.current(...currentArgs.current);
          console.log(fnRef, fn);
          fn(...currentArgs.current);
          timer.current = undefined;
        }, _wait);
      }
    },
    [_wait]
  );
  useUpdateEffect(() => {
    console.log('执行useUpdateEffect');
    run();
    return cancel;
  }, [..._deps, run]);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return [run, { cancel }];
}

export function useDebounce<T>(value: T, wait: number): T {
  const [state, setState] = useState(value);

  // const [run, { cancel }] = useDebounceFn(
  // 	() => {
  // 		setState(value);
  // 		console.log('我要干的函数');
  // 	},
  // 	[value],
  // 	wait,
  // );

  // useEffect(() => {
  // 	run();
  // }, [value, run]);

  //避免第一次执行！！！！
  useDebounceFn(
    () => {
      setState(value);
      console.log('我要干的函数');
    },
    [value],
    wait
  );

  return state;
}

// 13 13 13 13 13 13 13 13
// 节流  useThrottle
//
// 效果：频繁触发 run，只会每隔 300ms 执行一次 （如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效）
// type noop = (...args: any) => any;
// export function useThrottle<T extends any[]>(
// 	fn: (...args: T) => any,
// 	delay: number,
// ) {
// 	const fnRef = useRef<(...arg: any[]) => any>(fn);
// 	fnRef.current = fn;

// 	const wait = options?.wait ?? 1000;
// 	return (...args: T) => {
// 		const now = Date.now();
// 		console.log('时间', now - last);
// 		if (now - last > delay) {
// 			alert(1);
// 			last = now;
// 			// fn.apply(this, args);
// 			// fn();
// 			fnRef.current();
// 		}
// 	};
// }

export function useThrottle<T extends any[]>(
  fn: (...args: T) => any,
  delay: number
) {
  let last = Date.now(); // 上次触发时间
  console.log('上次触发时间', last);
  const fnRef = useRef<(...arg: any[]) => any>(fn);
  fnRef.current = fn;
  return (...args: T) => {
    const now = Date.now();
    console.log('时间', now - last);
    if (now - last > delay) {
      alert(1);
      last = now;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fnRef.current!.apply(this, args);
      fnRef.current();
    }
  };
}

// 14 14 14 14 14 14 14
// 倒计时 useCountDown
type CountDownFn = [
  number,
  {
    start: (
      from?: number,
      to?: number,
      options?: { ms?: number; step?: number }
    ) => void;
  }
];
export function useCountDown(): CountDownFn {
  const [count, setCount] = useState(0);
  let timer: any;
  let current: number;

  useEffect(() => {
    return () => {
      timer && clearTimeout(timer);
    };
  }, [timer]);

  const start = usePersistFn(
    (f?: number, t?: number, options: { ms?: number; step?: number } = {}) => {
      console.log('f', f, t);
      const from = f || 60;
      const to = t || 0;
      const ms = options.ms || 1000;
      const step = options.step || 1;
      current = from;
      const countdown = () => {
        setCount(current);

        current = current - step;
        console.log('current', current);

        if (current < to) {
          clearTimeout(timer);
          return;
        }

        timer = setTimeout(() => {
          countdown();
        }, ms);
      };

      countdown();
    }
  );

  return [count, { start }];
}

//15 15 15 15 15 15 15 15
// useInViewport  判断dom是否在可视范围之内
// const observer = new IntersectionObserver((entries) => {}

type InViewport = boolean | undefined;
function isInViewPort(el: HTMLElement): InViewport {
  if (!el) {
    return undefined;
  }
  const viewPortWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  console.log('666', viewPortWidth, viewPortHeight);
  const rect = el.getBoundingClientRect();
  //const rect = el.getElementRect(元素的current);  //
  if (rect) {
    const { top, bottom, left, right } = rect;
    return (
      bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0
    );
  }
  return false;
}
export function useInViewport(target: BasicTarget): InViewport {
  const [inViewPort, setInViewport] = useState<InViewport>(() => {
    const el = getTargetElement(target);
    return isInViewPort(el as HTMLElement);
    // return undefined;
  });

  useEffect(() => {
    const el = getTargetElement(target);

    if (!el) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInViewport(true);
        } else {
          setInViewport(false);
        }
      }
    });

    observer.observe(el as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return inViewPort;
}

//16 16 16 16 16 16 16 16
// useSize
// 一个用于监听 dom 节点尺寸变化的 Hook
// npm i resize-observer-polyfill
type Size = { width?: number; height?: number };
export function useSize(target: BasicTarget): Size {
  const [state, setState] = useState<Size>(() => {
    const el = getTargetElement(target);
    return {
      width: ((el || {}) as HTMLElement).clientWidth,
      height: ((el || {}) as HTMLElement).clientHeight,
    };
  });

  useLayoutEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setState({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });

    resizeObserver.observe(el as HTMLElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [target]);

  return state;
}

//17 17 17 17 17 17 17
// useScroll
// 获取元素的滚动状态。
interface Position {
  left: number;
  top: number;
}

export type Target = BasicTarget<HTMLElement | Document>;
export type ScrollListenController = (val: Position) => boolean;
export function useScroll(
  target?: Target,
  shouldUpdate: ScrollListenController = () => true
): Position {
  const [position, setPosition] = useState<Position>({
    left: NaN,
    top: NaN,
  });
  const shouldUpdatePersist = usePersistFn(shouldUpdate);

  useEffect(() => {
    const el = getTargetElement(target, document);
    if (!el) return;

    function updatePosition(currentTarget: Target): void {
      let newPosition;
      if (currentTarget === document) {
        if (!document.scrollingElement) return;
        newPosition = {
          left: document.scrollingElement.scrollLeft,
          top: document.scrollingElement.scrollTop,
        };
      } else {
        newPosition = {
          left: (currentTarget as HTMLElement).scrollLeft,
          top: (currentTarget as HTMLElement).scrollTop,
        };
      }
      console.log(
        shouldUpdatePersist(newPosition),
        'shouldUpdatePersist(newPosition)'
      );
      if (shouldUpdatePersist(newPosition)) setPosition(newPosition);
    }
    updatePosition(el as Target);

    function listener(event: Event): void {
      if (!event.target) return;
      updatePosition(event.target as Target);
    }

    el.addEventListener('scroll', listener);
    return () => {
      el.removeEventListener('scroll', listener);
    };
  }, [shouldUpdatePersist, target]);

  return position;
}

// 18 18 18 18 18 18 18 18
// useTextSelection
// 实时获取用户当前选取的文本内容及位置。
// eg: 划线翻译

//19 19 19 19 19 19 19
// useLockFn   防止重复提交,  向异步函数添加锁以防止并行执行
export function useLockFn<P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) {
  const lockRef = useRef(false);

  const useCall = useCallback(
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
    [fn]
  );
  return useCall;
}

// 20 20 20 20 20 20 20
// useCreation
// 因为 useMemo 不能保证被 memo 的值一定不会被重计算，而 useCreation 可以保证这一点。以下为 React 官方文档中的介绍：
// You may rely on useMemo as a performance optimization, not as a semantic guarantee.In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance.
// 而相比于 useRef，你可以使用 useCreation 创建一些常量，这些常量和 useRef 创建出来的 ref 有很多使用场景上的相似，但对于复杂常量的创建，useRef 却容易出现潜在的性能隐患。
export function useCreation<T>(factory: () => T, deps: any[]) {
  // 通过useRef设置一个标记initialized
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });

  // 判断第一次 或者依赖变化的对象发生改变时 触发factory
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}

/**
 * @description: 判断依赖性deps是否发生改变
 * @param {any} oldDeps
 * @param {any} deps
 * @return {*}
 */
function depsAreSame(oldDeps: any[], deps: any[]): boolean {
  if (oldDeps === deps) return true;
  for (const i in oldDeps) {
    if (oldDeps[i] !== deps[i]) return false;
  }
  return true;
}

// 21 21 21 21 21 21 21
// useTimeout
export function useTimeout(
  fn: () => void,
  delay: number | null | undefined
): void {
  const timerFn = usePersistFn(fn);

  useEffect(() => {
    if (delay === undefined || delay === null) return;
    const timer = setTimeout(() => {
      timerFn();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, timerFn]);
}

// 22 22 22 22 22 22 22
//！！！ useWebSocket
export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  reconnectLimit?: number;
  reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onMessage?: (message: WebSocketEventMap['message']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
}

export interface Result {
  latestMessage?: WebSocketEventMap['message'];
  sendMessage?: WebSocket['send'];
  disconnect?: () => void;
  connect?: () => void;
  readyState: ReadyState;
  webSocketIns?: WebSocket;
}
export function useWebSocket(socketUrl: string, options: Options = {}): Result {
  const {
    reconnectLimit = 3,
    reconnectInterval = 3 * 1000,
    manual = false,
    onOpen,
    onClose,
    onMessage,
    onError,
  } = options;
  const reconnectTimesRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout>();
  const websocketRef = useRef<WebSocket>();

  const [latestMessage, setLatestMessage] =
    useState<WebSocketEventMap['message']>();
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Closed);
  /**
   * 重连
   */
  const reconnect = usePersistFn(() => {
    if (
      reconnectTimesRef.current < reconnectLimit &&
      websocketRef.current?.readyState !== ReadyState.Open
    ) {
      reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current);

      reconnectTimerRef.current = setTimeout(() => {
        connectWs();
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  });

  const connectWs = usePersistFn(() => {
    reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current);

    if (websocketRef.current) {
      websocketRef.current.close();
    }

    try {
      websocketRef.current = new WebSocket(socketUrl);
      websocketRef.current.onerror = (event) => {
        reconnect();
        onError && onError(event);
        setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
      };
      websocketRef.current.onopen = (event) => {
        onOpen && onOpen(event);
        reconnectTimesRef.current = 0;
        setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
      };
      websocketRef.current.onmessage = (
        message: WebSocketEventMap['message']
      ) => {
        onMessage && onMessage(message);
        setLatestMessage(message);
      };
      websocketRef.current.onclose = (event) => {
        reconnect();
        onClose && onClose(event);
        setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
      };
    } catch (error) {
      throw error;
    }
  });

  /**
   * 发送消息
   * @param message
   */
  const sendMessage: WebSocket['send'] = usePersistFn((message) => {
    if (readyState === ReadyState.Open) {
      websocketRef.current?.send(message);
    } else {
      throw new Error('WebSocket disconnected');
    }
  });

  /**
   * 手动 connect
   */
  const connect = usePersistFn(() => {
    reconnectTimesRef.current = 0;
    connectWs();
  });

  /**
   * disconnect websocket
   */
  const disconnect = usePersistFn(() => {
    reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current);

    reconnectTimesRef.current = reconnectLimit;
    websocketRef.current?.close();
  });

  useEffect(() => {
    // 初始连接
    if (!manual) {
      connect();
    }
  }, [socketUrl, connect, manual]);

  useUnmount(() => {
    disconnect();
  });

  return {
    latestMessage,
    sendMessage,
    connect,
    disconnect,
    readyState,
    webSocketIns: websocketRef.current,
  };
}

// 23 23 23 23 23 23 23
// useDefaultsRef and useDefaults
export function useDefaults<T>(defaultValue: T, ...args: Array<T | void>): T {
  for (const v of args) {
    console.log('defaultValue-v--args', defaultValue, v, args);
    if (v != null) {
      return v;
    }
  }
  return defaultValue;
}

export function useDefaultsRef<T>(
  defaultValue: T,
  ...args: Array<T | void>
): MutableRefObject<T> {
  const value = useDefaults<T>(defaultValue, ...args);
  console.log('value', value);
  const ref = useRef(value);
  return ref;
}

//24 24 24 24 24 24 24 24
// 受控组件 useControlledState

interface ControlledOptions<T> {
  value?: T;
  defaultValue: T | (() => T);
  onChange?: (v: T) => void;
}
interface ControlledState<R> {
  //函数返回值类型
  controlled: boolean;
  value: R;
  onChangeRef: MutableRefObject<(v: R) => void>;
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

    return typeof defaultValue === 'function'
      ? (defaultValue as any)()
      : defaultValue;
  });

  const controlled = value !== undefined;
  const mergedValue = controlled ? value : innerValue; //value  defaultValue

  useUpdateEffect(() => {
    if (value !== undefined) {
      setInnerValue(value); //value变化 触发useState
    }
  }, [value]);

  const onChangeRef = useDefaultsRef((v: any) => {
    if (!controlled) {
      setInnerValue(v);
    }

    if (_onChange) {
      _onChange(v);
    }
  });

  return { controlled, value: mergedValue as any, onChangeRef };
}

//25 25 25 25 25 25 25 25
// useHover
export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
}

function useEventListener(
  eventName: string = defaultEvent,
  fn: () => void,
  target: BasicTarget | BasicTarget[]
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const targets = Array.isArray(target) ? target : [target]; //目标元素
    const targetElement = getTargetElement(targets[0]) as HTMLElement;
    targetElement.addEventListener(eventName, fn);

    return () => {
      targetElement.removeEventListener(eventName, fn);
    };
  }, [target, eventName]);
}

export function useHover(target: BasicTarget, options?: Options) {
  const { onEnter, onLeave } = options || {};
  const [state, setState] = useState<boolean>(false);

  useEventListener(
    'mouseenter',
    () => {
      onEnter && onEnter();
      setState(true);
    },
    target
  );

  useEventListener(
    'mouseleave',
    () => {
      onLeave && onLeave();
      setState(false);
    },
    target
  );

  return state;
}

//26 26 26 26 26 26 26 26 26 26
// useSize
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

//26.1 26.1 26.1 26.1 26.1 26.1 26.1 26.1
// useDrag

//26 26 26 26 26 26 26 26 26 26
// useDrop
type getDragPropsFn = (data: any) => {
  draggable: 'true';
  key?: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
};
interface IConfig {
  onDragStart?: (data: any, e: React.DragEvent) => void;
  onDragEnd?: (data: any, e: React.DragEvent) => void;
  /**
   * 是否在getProps方法返回的对象中包含默认的key
   *
   * @default true
   */
  getPropsWithKey?: boolean;
}

export function useDrag(config?: IConfig): getDragPropsFn {
  const getProps = (data: any) => {
    return {
      key:
        config && config.getPropsWithKey === false
          ? undefined
          : JSON.stringify(data),
      draggable: 'true' as const,
      onDragStart: (e: React.DragEvent) => {
        if (config && config.onDragStart) {
          config.onDragStart(data, e);
        }
        e.dataTransfer.setData('custom', JSON.stringify(data));
      },
      onDragEnd: (e: React.DragEvent) => {
        if (config && config.onDragEnd) {
          config.onDragEnd(data, e);
        }
      },
    };
  };

  return getProps;
}

export interface DropAreaOptions {
  onFiles?: (files: File[], event?: React.DragEvent) => void;
  onUri?: (url: string, event?: React.DragEvent) => void;
  onDom?: (content: any, event?: React.DragEvent) => void;
  onText?: (text: string, event?: React.ClipboardEvent) => void;
}
export interface DropAreaState {
  isHovering: boolean;
}

const getProps = (
  callback: (
    dataTransfer: DataTransfer,
    event: React.DragEvent | React.ClipboardEvent
  ) => void,
  setIsHovering: (over: boolean) => void
): DropProps => ({
  onDragOver: (event: React.DragEvent) => {
    event.preventDefault();
  },
  onDragEnter: (event: React.DragEvent) => {
    event.preventDefault();
    setIsHovering(true);
  },
  onDragLeave: () => {
    setIsHovering(false);
  },
  onDrop: (event: React.DragEvent) => {
    event.preventDefault();
    event.persist();
    setIsHovering(false);
    callback(event.dataTransfer, event);
  },
  onPaste: (event: React.ClipboardEvent) => {
    event.persist();
    callback(event.clipboardData, event);
  },
});

export interface DropProps {
  onDragOver: React.DragEventHandler;
  onDragEnter: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onPaste: React.ClipboardEventHandler;
}

export function useDrop(
  options: DropAreaOptions = {}
): [DropProps, DropAreaState] {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  // createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。

  const [isHovering, setIsHovering] = useState<boolean>(false);

  const callback = useCallback(
    (
      dataTransfer: DataTransfer,
      event: React.DragEvent | React.ClipboardEvent
    ) => {
      const uri = dataTransfer.getData('text/uri-list');
      const dom = dataTransfer.getData('custom');

      if (dom && optionsRef.current.onDom) {
        let data = dom;
        try {
          data = JSON.parse(dom);
        } catch (e) {
          data = dom;
        }
        optionsRef.current.onDom(data, event as React.DragEvent);
        return;
      }

      if (uri && optionsRef.current.onUri) {
        optionsRef.current.onUri(uri, event as React.DragEvent);
        return;
      }

      if (
        dataTransfer.files &&
        dataTransfer.files.length &&
        optionsRef.current.onFiles
      ) {
        optionsRef.current.onFiles(
          Array.from(dataTransfer.files),
          event as React.DragEvent
        );
        return;
      }

      if (
        dataTransfer.items &&
        dataTransfer.items.length &&
        optionsRef.current.onText
      ) {
        dataTransfer.items[0].getAsString((text) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          optionsRef.current.onText!(text, event as React.ClipboardEvent);
        });
      }
    },
    []
  );

  const props: DropProps = useMemo(
    () => getProps(callback, setIsHovering),
    [callback, setIsHovering]
  );

  return [props, { isHovering }];
}

//27 27 27 27 27 27 27 27
//useEventEmitter   (可以通过 Context或者props的情况传递event$)
//   const focus$ = useEventEmitter();
//       <MessageBox focus$={focus$} />
//       <InputBox focus$={focus$} />
type Subscription<T> = (val: T) => void;

export class EventEmitter<T> {
  private subscriptions = new Set<Subscription<T>>();
  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };

  useSubscription = (callback: Subscription<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      this.subscriptions.add(subscription);
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  };
}

export function useEventEmitter<T = void>() {
  const ref = useRef<EventEmitter<T>>();
  if (!ref.current) {
    ref.current = new EventEmitter();
  }
  return ref.current;
}

export function onAsyncCreated<T = void>(cb: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    cb()
      .then((result) => {
        resolve(result);
      })
      .catch((...errors) => {
        reject(...errors);
      });
  });
}

export function onAsyncMounted<T = void>(cb: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    useMount(() => {
      cb()
        .then((result) => {
          resolve(result);
        })
        .catch((...errors) => {
          reject(...errors);
        });
    });
  });
}

//异步控制并发数
export function limitRequest(urls = [], limit = 5) {
  return new Promise((resolve, reject) => {
    const len = urls.length;
    let count = 0; // 当前进行到第几个任务

    const start = async () => {
      const url = urls.shift(); // 从数组中拿取第一个任务
      if (url) {
        try {
          await axios.post(url);
          if (count == len - 1) {
            // 最后一个任务
            resolve('ok');
          } else {
            count++;
            // 成功，启动下一个任务
            start();
          }
        } catch (e) {
          count++;
          // 失败，也启动下一个任务
          start();
        }
      }
    };

    // 启动limit个任务
    while (limit > 0) {
      start();
      limit -= 1;
    }
  });
}

// 测试
// limitRequest(['http://xxa', 'http://xxb', 'http://xxc', 'http://xxd', 'http://xxe'])

// 简易版本promise
class MyPromise {
  constructor(executor) {
    // executor执行器
    this.status = 'pending'; // 等待状态
    this.value = null; // 成功或失败的参数
    this.fulfilledCallbacks = []; // 成功的函数队列
    this.rejectedCallbacks = []; // 失败的函数队列
    const that = this;

    function resolve(value) {
      // 成功的方法
      if (that.status === 'pending') {
        that.status = 'resolved';
        that.value = value;
        that.fulfilledCallbacks.forEach((myFn) => myFn(that.value)); //执行回调方法
      }
    }

    function reject(value) {
      //失败的方法
      if (that.status === 'pending') {
        that.status = 'rejected';
        that.value = value;
        that.rejectedCallbacks.forEach((myFn) => myFn(that.value)); //执行回调方法
      }
    }

    //自执行
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // 类方法
  then(onFulfilled, onRejected) {
    // 等待状态，添加回调函数到成功的函数队列
    if (this.status === 'pending') {
      this.fulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      // 等待状态，添加回调函数到失败的函数队列
      this.rejectedCallbacks.push(() => {
        onRejected(this.value);
      });
    }
    //成功状态
    if (this.status === 'resolved') {
      // 支持同步调用
      console.log('this', this);
      onFulfilled(this.value);
    }

    if (this.status === 'rejected') {
      // 支持同步调用
      onRejected(this.value);
    }
  }
}

// 简易版 promiseAll

Promise.prototype.all = function (promises) {
  let results = [];
  let promiseCount = 0;
  let promisesLength = promises.length;
  return new Promise(function (resolve, reject) {
    for (let val of promises) {
      Promise.resolve(val).then(
        function (res) {
          promiseCount++;
          // results.push(res);
          results[i] = res;
          // 当所有函数都正确执行了，resolve输出所有返回结果。
          if (promiseCount === promisesLength) {
            return resolve(results);
          }
        },
        function (err) {
          return reject(err);
        }
      );
    }
  });
};
