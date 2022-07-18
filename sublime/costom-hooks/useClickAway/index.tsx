import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { useClickAway } from '../hooks';

const UseClickAways: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	const changValue = () => {
		setValue(value + 1);
	};

	const ref = useRef<HTMLSpanElement>(null);

	useClickAway(() => {
		setValue((s) => s + 1);
	}, ref);

	console.log('父组件render');

	return (
		<div>
			父组件{value}
			<span
				ref={ref}
				style={{
					width: '300px',
					height: '300px',
					border: '1px solid red',
				}}
				// onClick={changValue}
			>
				box盒子
			</span>
		</div>
	);
};

UseClickAways.displayName = 'UseClickAways';

export default UseClickAways;
