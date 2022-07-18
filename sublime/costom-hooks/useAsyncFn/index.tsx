import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useEffect,
} from 'react';
import { useAsyncFn } from '../hooks';
import orderApi from '../utils/baseApi';

const UseAsyncFc: FC = (_props) => {
	const [value, setValue] = useState<number>(1);

	console.log('useAsync父组件,value', value);

	// const fn = () => {
	// 	console.log('执行');
	// 	return 1;
	// };
	// const fnRef = useRef<(...arg: any[]) => any>(fn);
	// console.log(fnRef.current());

	const [
		{ loading: loginPageLoading, data: pageDate },
		{ run: initLoginPage, mutate: mutatePage }, //mutatePage 更新数据
	] = useAsyncFn(
		(
			prevPage?: number | undefined | null,
			status?: string | null,
		): Promise<number | string | undefined | null> => {
			console.log('3333333333', prevPage, status);
			return orderApi.randomData({
				data: prevPage == undefined ? 2 : prevPage * 2,
			});
		},
		{
			cacheData: true,
			onSuccess: (res) => {
				console.log('成功---res', res);
			},
			onError: (err) => {
				console.error('error', err);
			},
		},
	);

	// 加载页面
	useEffect(() => {
		initLoginPage();
	}, [initLoginPage]);

	return (
		<div>
			useAsync父组件{value}
			<div>-----{pageDate}-----</div>
			<button onClick={() => initLoginPage()}>刷新按钮</button>
			<button onClick={() => initLoginPage(2)}>加载按钮</button>
			<button onClick={() => mutatePage(99)}>更新按钮</button>
		</div>
	);
};

UseAsyncFc.displayName = 'UseAsyncFc';

export default UseAsyncFc;
