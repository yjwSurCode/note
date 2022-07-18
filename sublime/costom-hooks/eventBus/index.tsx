import React, {
	FC,
	useMemo,
	useState,
	useEffect,
	useCallback,
	useRef,
} from 'react';
import { useClickAway } from '../hooks';
import List from './list';
import { usePersistFn } from '../hooks';
import baseApi from '../utils/baseApi';

function useOrderDetailChange(cb: (order: any) => void): void {
	//页面加载完毕 已经开始监听
	const cbFn = usePersistFn(cb);
	useEffect(() => {
		const unSubscribe = baseApi.subscribeOrderDetailChange((no) => {
			cbFn(no);
		});
		return unSubscribe;
	}, [cbFn]);
}

const EventBus: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	const list = useMemo(() => {
		return [
			{
				name: 'a',
				age: 1,
			},
			{
				name: 'b',
				age: 2,
			},
			{
				name: 'c',
				age: 3,
			},
		];
	}, []);

	//监听
	useOrderDetailChange((value) => {
		console.log('监听函数--回显', value);
	});

	const emitBusHandle = () => {
		console.log(1);
		baseApi.confirmOrder({ orderNo: '1' });
	};

	return (
		<div>
			EventBus组件{value}
			<div>
				{list.map((item, index) => {
					return (
						<div key={index}>
							<List value={item} />

							<button onClick={emitBusHandle}>按钮</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

EventBus.displayName = 'EventBus';

export default EventBus;
