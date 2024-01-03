import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
} from 'react';
import { UsePersistFnProps } from '../interface';
import { usePersistFn } from '../hooks';
const usePersistFns: FC<UsePersistFnProps> = (_props: UsePersistFnProps) => {
	const [value, setValue] = useState<number>(1);
	const fancyInputRef = useRef<HTMLInputElement>(null);
	const changValue = () => {
		setValue(value + 1);
	};

	const showCountPersistFn = usePersistFn(() => {
		alert(value);
	});

	const _value = usePersistFn(() => {
		return value;
	});
	console.log('_value', _value);

	const showCountCommon = useCallback(() => {
		alert(value);
	}, [value]);

	const getValue = usePersistFn(() => value);

	console.log('父组件render');
	return (
		<div>
			父组件{value}
			<button onClick={changValue}>点击改变value</button>
			<ExpensiveTree showCount={showCountPersistFn} />
			------------- useCallback:
			<ExpensiveTree showCount={showCountCommon} />
			普通： -------------
			{/* <ExpensiveTrees value={getValue} /> */}
			<ExpensiveTrees value={value} />
			new:
			<ExpensiveTrees value={_value()} />
			forwardRef子组件:
			<FancyInput ref={fancyInputRef} />
			<button onClick={() => fancyInputRef.current?.focus()}>按钮</button>
		</div>
	);
};

// eslint-disable-next-line react/display-name
const ExpensiveTree = React.memo<{ [key: string]: any }>(({ showCount }) => {
	const renderCountRef = useRef(0);
	renderCountRef.current += 2;
	return (
		<div>
			<p>Render Count: {renderCountRef.current}</p>
			<button type="button" onClick={showCount}>
				showParentCount
			</button>
		</div>
	);
});

// eslint-disable-next-line react/display-name
const ExpensiveTrees = React.memo<{ [key: string]: any }>(({ value }) => {
	const renderCountRef = useRef(0);
	renderCountRef.current += 2;
	console.log(22222222);
	return (
		<div>
			<div>父组件的值:{value}</div>
			<p>Render Count: {renderCountRef.current}</p>
		</div>
	);
});

// eslint-disable-next-line react/display-name
const FancyInput = React.forwardRef((_props, ref) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(
		//<HTMLInputElement | null, HTMLInputElement | null>
		ref,
		() => ({
			focus: () => {
				if (inputRef.current) inputRef.current.focus();
			},
		}),
	);
	// useImperativeHandle<HTMLUListElement | null, HTMLUListElement | null>(
	// 	ref,
	// 	() => rootRef.current,
	// 	[],
	// );
	// useImperativeHandle<StepperRef, StepperRef>(ref, () => {
	// 	return {
	// 		root: rootRef.current,
	// 		input: inputRef.current,
	// 	};
	// });
	return (
		<div>
			<input ref={inputRef} type="text" />
		</div>
	);
});

usePersistFns.displayName = 'usePersistFns';

export default usePersistFns;

const { areaCode, areaType } = this;

const { storesTab = [] } = await getAllChannelTab({ typeCode: areaType, areaCode })     // typeCode: bigarea, areaCode: cPG0

const c = await getAllChannelTab({ type: "1", typeCode: areaType, areaCode });
const { storesTab = [] } = await getAllChannelTab()
import { getAllChannelTab } from '@/pages/b2c-report/service';



import { getAllChannelTab } from '@/services/store-services.js';
const { storesTab = [] } = await getAllChannelTab()



import { getAllChannelTab } from '@/pages/b2c-report/service';

const { storesTab = [] } = await getAllChannelTab({})






import { getAllChannelTab } from '@/services/store-services.js';
