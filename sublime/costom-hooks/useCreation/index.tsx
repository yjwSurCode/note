import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { useCreation } from '../hooks';

const UseCreation: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	const foo = useCreation(() => <Test value={value}></Test>, []);

	const getValue = useCreation(() => value, []); //当依赖值没有发生变化的时候不会触发更新

	console.log(foo);

	return (
		<div>
			父组件--useCreation{value}---{getValue}
			<div>子组件:</div>
			<button onClick={() => setValue(value + 1)}>点击</button>
			{foo}
		</div>
	);
};

interface InterValue {
	value: number;
}
const Test: FC<InterValue> = (_props: InterValue) => {
	console.log('aa-test-render', _props.value);

	return (
		<div>
			Test
			<button
				onClick={() => {
					console.log(_props.value);
				}}
			>
				子组件点击
			</button>
		</div>
	);
};

UseCreation.displayName = 'UseCreation';

export default UseCreation;
