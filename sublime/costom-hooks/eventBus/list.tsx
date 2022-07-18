import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { useClickAway } from '../hooks';

interface ListProps {
	value: any;
}

interface ListValue {
	name: string;
	age: number;
}
const List: FC<ListProps> = (_props: ListProps) => {
	const { value } = _props;
	console.log(value, 'value');
	const { name, age } = value;
	return (
		<div>
			list组件
			<div>详情:{name}</div>
		</div>
	);
};

export default List;
