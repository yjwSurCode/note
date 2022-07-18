import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
	useEffect,
} from 'react';
import { useDefaults, useDefaultsRef, useControlledState } from '../hooks';

interface Inter {
	value?: number | any;
	defaultValue?: number | any;
	onChange?: (v?: any) => void;
}
const UseControlledStateF: FC<Inter> = (_props: Inter) => {
	const { value: _value, defaultValue, onChange: _onChange } = _props;

	const [value, setValue] = useState<number | any>(1);

	// example
	// useDefaults<string>('2', ['1', '22', '44']);

	const b = useDefaultsRef({ name: '小黑' }, [1, '2,3']);
	const c = useDefaultsRef({ name: '小黑' });
	const d = useDefaultsRef(value);
	console.log('bbb', value, b, c.current);

	const onChangeRef = useDefaultsRef((v: any) => {
		return 1;
	});

	useEffect(() => {
		console.log('useEffect', d);
		d.current = '第一次';
		console.log('useEffect--', d);
	}, [d]);

	const {
		value: avtiveKey,
		controlled,
		onChangeRef: _onChangeRef,
	} = useControlledState<any[]>({
		value: _value, //_value props来的
		defaultValue,
		onChange: _onChange, //_onChange props来的
	});

	console.log('函数', avtiveKey, controlled, _onChangeRef.current);

	return (
		<div>
			useControlledState--受控组件---{avtiveKey}
			<div onClick={() => _onChangeRef.current([2])}>点击</div>
		</div>
	);
};

const UseControlledStateFN: FC = (_props) => {
	const onChangeHandle = (v: any) => {
		console.log('vvvv', v);
		setValue(v);
	};

	const [value, setValue] = useState(1);

	return (
		<div>
			<div
				onClick={() => {
					alert(1);
				}}
			>
				父组件---
			</div>
			<UseControlledStateF
				// value={value}
				defaultValue={111}
				// onChange={onChangeHandle}
			></UseControlledStateF>
		</div>
	);
};

UseControlledStateFN.displayName = 'UseControlledStateFN';

export default UseControlledStateFN;
