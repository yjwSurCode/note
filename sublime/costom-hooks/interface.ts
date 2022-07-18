import { HTMLAttributes } from 'react';
export interface UsePersistFnProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	rows?: number;
	focusEmitter?: any;
}
