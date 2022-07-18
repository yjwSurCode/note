import React, {
	FC,
	useMemo,
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
} from 'react';
import { UsePersistFnProps } from '../interface';
import { useHover, useDrag, useDrop, useEventEmitter } from '../hooks';

const UseEventEmitterFn: FC<UsePersistFnProps> = (
	_props: UsePersistFnProps,
) => {
	const focusEmitter = useEventEmitter();

	const [dragging, setDragging] = useState<string | null>(null);
	const getDragProps = useDrag({
		onDragStart: (data) => {
			setDragging(data);
		},
		onDragEnd: () => {
			setDragging(null);
		},
	});
	const [props, { isHovering }] = useDrop({
		onText: (text, e) => {
			console.log(e);
			alert(`'text: ${text}' dropped`);
		},
		onFiles: (files, e) => {
			console.log(e, files);
			alert(`${files.length} file dropped`);
		},
		onUri: (uri, e) => {
			console.log(e);
			alert(`uri: ${uri} dropped`);
		},
		onDom: (content: string, e) => {
			alert(`custom: ${content} dropped`);
		},
	});

	return (
		<div>
			<div>UseEventEmitterFn:::</div>
			<div>
				<Child focusEmitter={focusEmitter} />
				<Brother focusEmitter={focusEmitter} />
			</div>

			<div>useDrop::::</div>
			<div>
				<div
					style={{
						border: '1px dashed #e8e8e8',
						padding: 16,
						textAlign: 'center',
					}}
					{...props}
				>
					{isHovering ? 'release here' : 'drop here'}
				</div>

				<div style={{ display: 'flex', marginTop: 8 }}>
					{Array.from(Array(5)).map((e, i) => (
						<div
							key={i}
							{...getDragProps(`box${i}`)}
							style={{
								border: '1px solid #e8e8e8',
								padding: 16,
								width: 80,
								textAlign: 'center',
								marginRight: 16,
							}}
						>
							box{i}
						</div>
					))}
				</div>
				<div style={{ marginTop: 8 }}>
					{dragging ? <>dragging {dragging}</> : 'not dragging'}
				</div>
			</div>
		</div>
	);
};

const Child: FC<UsePersistFnProps> = (_props: UsePersistFnProps) => {
	return (
		<div>
			child
			<button
				type="button"
				onClick={() => {
					_props.focusEmitter.emit('参数'); // 来触发的方法
				}}
			>
				Reply
			</button>
		</div>
	);
};
const Brother: FC<UsePersistFnProps> = (_props: UsePersistFnProps) => {
	const inputRef = useRef<any>();
	_props.focusEmitter.useSubscription((e: string) => {
		console.log(e, 'eeeee');
		//接收方法
		inputRef.current.focus();
	});

	return (
		<div>
			brother
			<input
				ref={inputRef}
				placeholder="Enter reply"
				style={{ width: '100%', padding: '4px' }}
			/>
		</div>
	);
};

UseEventEmitterFn.displayName = 'UseEventEmitterFn';

export default UseEventEmitterFn;
