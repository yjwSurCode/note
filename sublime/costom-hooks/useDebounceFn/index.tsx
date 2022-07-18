import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useEffect,
} from 'react';
import {
	usePrevious,
	useUpdateEffect,
	useDebounce,
	useDebounceFn,
	useThrottle,
} from '../hooks';

const UseDebounceFn: FC = (_props) => {
	const [value, setValue] = useState<number>(1);
	const [values, setValues] = useState<string>('1');

	useUpdateEffect(() => {
		console.log('aa-useUpdateEffect', value);
	}, [value]);

	useEffect(() => {
		console.log('aa-useEffect', value);
	}, [value]);

	console.log('父组件render-UseDebounceFn', value);

	const add = () => {
		setValue(value + 1);
	};
	// const add = () => {
	// 	// eslint-disable-next-line react-hooks/rules-of-hooks
	// 	useDebounceFn(
	// 		() => {
	// 			setValue(value + 1);
	// 		},
	// 		[value],
	// 		500,
	// 	);
	// };

	const debouncedValue = useDebounce(values, 200);

	useThrottle(() => {
		console.log('useThrottleuseThrottleuseThrottle');
	}, 2000)();

	useDebounceFn(
		() => {
			console.log('useDebounceFn');
		},
		[value],
		2000,
	);

	console.log(values, 'values');

	// const { run: DebounceRun, cancel } = useDebounceFn(
	// 	() => {
	// 		setValue(value + 1);
	// 	},
	// 	[value],
	// 	500,
	// );

	const onInputChange = (nextValue: string) => {
		console.log(nextValue, 'nextValue');
		setValues(nextValue);
	};

	return (
		<div>
			父组件UseDebounceFn: {value}
			<button onClick={add}>按钮</button>
			debouncedValue:{debouncedValue}
			<input
				type="text"
				onChange={(e) => onInputChange(e.target.value)}
				// value={value}
			/>
		</div>
	);
};

UseDebounceFn.displayName = 'UseDebounceFn';

export default UseDebounceFn;
