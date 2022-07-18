import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { usePrevious, useLockFn, useTimeout } from '../hooks';

function mockApiRequest(e: any) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(e);
		}, 2000);
		// resolve(e);
		// useTimeout(() => resolve(e), 500);
	});
}
const UsePreviousFc: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	const previousValue = usePrevious(value, (prev: any, next: any) => {
		return false;
	});

	const lock = useLockFn(async () => {
		await mockApiRequest(value);
		// .then(() => {
		// 	console.log('then');
		// 	return '你好';
		// });
		console.log('11111');
		setValue(value + 1);
	});

	// const lock = useCallback(async () => {
	// 	await mockApiRequest(value);

	// 	setValue(value + 1);
	// }, [value]);

	console.log('lock', lock);

	console.log('父组件render-previousValue', previousValue);

	return (
		<div>
			父组件{value}
			<div>previousValue:{previousValue}</div>
			<button onClick={() => setValue(value + 1)}>增加</button>
			<button onClick={() => lock()}>lock按钮</button>
		</div>
	);
};

UsePreviousFc.displayName = 'UsePrevious';

export default UsePreviousFc;
