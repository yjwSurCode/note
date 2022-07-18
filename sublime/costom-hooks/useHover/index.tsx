import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
} from 'react';
import { UsePersistFnProps } from '../interface';
import { useHover } from '../hooks';
const UseHoverFn: FC<UsePersistFnProps> = (_props: UsePersistFnProps) => {
	const [value, setValue] = useState<number>(1);
	const demoRef = useRef<null>(null);
	const isHovering = useHover(demoRef);
	return (
		<div>
			<div ref={demoRef}>demo1:</div>
			<span>{isHovering ? 'now go' : null}</span>
			<div>demo2:</div>
		</div>
	);
};

UseHoverFn.displayName = 'usePersistFns';

export default UseHoverFn;
