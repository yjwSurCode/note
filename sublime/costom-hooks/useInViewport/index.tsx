import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { useInViewport, useSize, useScroll } from '../hooks';

const UseInViewport: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	console.log('父组件UseInViewport', value);

	const ref = useRef<HTMLDivElement>(null);
	const refBox = useRef<HTMLDivElement>(null);
	const refScolleBox = useRef<HTMLDivElement>(null);

	const inViewPort = useInViewport(ref);

	console.log('inViewPort', inViewPort);

	const state = useSize(refBox);

	console.log('state', state);

	const scroll = useScroll(refScolleBox, (val) => {
		console.log('aa-val', val);
		return val.left > 100;
	});

	console.log('aa-scroll', scroll);

	return (
		<div>
			父组件--useInViewport--and--useSize--useScoll{value}
			<div style={{ padding: '100px' }}>123</div>
			<div style={{ padding: '100px' }}>123</div>
			<div ref={ref} style={{ padding: '100px' }}>
				{inViewPort ? 'UseInViewport盒子' : '消失'}
			</div>
			<div
				ref={refBox}
				style={{
					padding: '100px',
					width: '100%',
					backgroundColor: 'blue',
				}}
			>
				useSize
			</div>
			<div
				ref={refScolleBox}
				style={{
					height: '160px',
					width: '160px',
					border: 'solid 1px #000',
					overflow: 'scroll',
					whiteSpace: 'nowrap',
					fontSize: '32px',
				}}
			>
				<div>onScoll1onScoll1onScoll1onScoll1onScoll1</div>
				<div>onScoll1</div>
				<div>onScoll1</div>
				<div>onScoll1</div>
				<div>onScoll1</div>
			</div>
			<div style={{ padding: '100px' }}>123</div>
		</div>
	);
};

UseInViewport.displayName = 'UseInViewport';

export default UseInViewport;
