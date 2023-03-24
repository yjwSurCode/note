import { ComponentType, DependencyList, lazy, LazyExoticComponent, PropsWithChildren, Ref } from 'react';
import { ArtisanError } from './error-utils';

export type ForwardRefProps<T, R> = PropsWithChildren<T> & {
	ref?: Ref<R>;
};

export class ImpassiveComponentLoadError extends ArtisanError {
	code = 'ERR_IMPASSIVE_COMPONENT_LOAD';
}

/*
https://github.com/vitejs/vite/discussions/4583#discussioncomment-1802717

export const createForwardRef = <T, P = any>(
	displayName: string,
	render: ForwardRefRenderFunction<T, P>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> => {
	render.displayName = displayName;
	return forwardRef(render);
};

export const createFC = <P = any>(displayName: string, fc: FunctionComponent<P>): FunctionComponent<P> => {
	fc.displayName = displayName;
	return fc;
}; */

export function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
	if (oldDeps === deps) return true;
	for (let i = 0; i < oldDeps.length; i++) {
		if (!Object.is(oldDeps[i], deps[i])) return false;
	}
	return true;
}

export function impassiveComponent<T extends ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
	return lazy(async () => {
		try {
			return await factory();
		} catch (err) {
			throw new ImpassiveComponentLoadError('Impassive component load error', { cause: err });
		}
	});
}
