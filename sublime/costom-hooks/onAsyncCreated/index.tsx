import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useEffect,
} from 'react';
import { useCreation, useMountedState } from '../hooks';

const OnAsyncCreated: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	const foo = useCreation(() => <Test value={value}></Test>, []);

	const getMountedState = useMountedState();

	console.log('getMountedState', getMountedState());

	useEffect(() => {
		console.log('getMountedState--', getMountedState()); //
	}, []);

	const getValue = useCreation(() => value, []); //当依赖值没有发生变化的时候不会触发更新

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
	return (
		<div>
			Test
			<button>子组件点击</button>
		</div>
	);
};

OnAsyncCreated.displayName = 'OnAsyncCreated';

export default OnAsyncCreated;
