import React, { FC, useMemo } from 'react';
import { createBEM } from '../utils/namespace';
import useProps from '../hooks/use-props';

const NS = 'fnx-skeleton';
const bem = createBEM(NS);

const Grid: FC = () => {
	return <div>costom-hooks</div>;
};
Grid.displayName = 'Grid';

export default Grid;
