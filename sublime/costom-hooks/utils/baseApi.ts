import React, { useEffect, useCallback, useRef } from 'react';
import { eventBus } from '../hooks';

import { usePersistFn } from '../hooks';

class BaseApi {
	private _events = eventBus();

	//定义监听监听函数
	subscribeOrderDetailChange(listener: (order: any) => void): () => void {
		console.log('events', listener, 'listener');
		this._events.on('order:detail:change', listener);
		return () => {
			this._events.off('order:detail:change', listener);
		};
	}

	/** 改变触发触发 */
	async confirmOrder(params: { orderNo: string }): Promise<void> {
		// await baseApi.backendRequest('/order/makePickUp', {
		// 	body: { orderNo: params.orderNo },
		// });

		console.log(params, 'params');

		const detail = { name: '新', age: 99 };
		this._events.emit('order:detail:change', detail);
	}

	// 获取随机数据
	async randomData(params: { data: number }): Promise<number> {
		// await baseApi.backendRequest('/order/makePickUp', {
		// 	body: { orderNo: params.orderNo },
		// });
		console.log(Math.round(Math.random() * 10) * params.data);
		// return (await Math.round(Math.random() * 10)) * params.data;

		return (await 2) * 10 * params.data;

		// await baseApi.backendRequest('/order/makePickUp', { body: { orderNo: params.orderNos.join(',') } });
	}
}

const baseApi = new BaseApi();
export default baseApi;
