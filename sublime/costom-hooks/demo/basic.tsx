import React, { useState } from 'react';
import UsePersistFns from '../usePersistFn/index';
import UseClickAways from '../useClickAway/index';
import EventBus from '../eventBus/index';
import UsePrevious from '../usePrevious/index';
import OnAsyncCreated from '../onAsyncCreated/index';
import UseAsyncFn from '../useAsyncFn/index';
import UseDebounceFn from '../useDebounceFn/index';
import UseInViewport from '../useInViewport/index';
import UseCreation from '../useCreation/index';
import UseControlledStateFN from '../useControlledState/index';
import UseHoverFn from '../useHover/index';
import UseEventEmitterFn from '../useEventEmitter/index';
import DemoBlock from '../../../site/components/DemoBlock';
export default function Basic(): ReturnType<React.FC> {
	return (
		<div className="demo-sklelton">
			11
			{/* <DemoBlock title="UsePersistFns">
				<UsePersistFns></UsePersistFns>
			</DemoBlock> */}
			{/*<DemoBlock title="UseClickAways">
				<UseClickAways></UseClickAways>
			</DemoBlock> */}
			{/* <DemoBlock title="EventBus">
				<EventBus></EventBus>
			</DemoBlock> */}
			{/* <DemoBlock title="UsePrevious--UseLock">
				<UsePrevious></UsePrevious>
			</DemoBlock> */}
			{/* <DemoBlock title="OnAsyncCreated">
				<OnAsyncCreated></OnAsyncCreated>
			</DemoBlock> */}
			{/* <DemoBlock title="UseAsyncFn">
				<UseAsyncFn></UseAsyncFn>
			</DemoBlock> */}
			<DemoBlock title="UseDebounceFn">
				<UseDebounceFn></UseDebounceFn>
			</DemoBlock>
			{/* <DemoBlock title="UseDebounceFn">
				<UseInViewport></UseInViewport>
			</DemoBlock> */}
			{/* <DemoBlock title="UseCreation">
				<UseCreation></UseCreation>
			</DemoBlock> */}
			{/* <DemoBlock title="UseCruseControlledStateFNeation">
				<UseControlledStateFN></UseControlledStateFN>
			</DemoBlock> */}
			{/* <DemoBlock title="UseHoverFn">
				<UseHoverFn></UseHoverFn>
			</DemoBlock> */}
			{/* <DemoBlock title="UseEventEmitterFn">
				<UseEventEmitterFn></UseEventEmitterFn>
			</DemoBlock> */}
		</div>
	);
}
