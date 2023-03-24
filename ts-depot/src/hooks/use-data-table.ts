import { TablePaginationConfig, TableProps } from 'antd';
import { ColumnGroupType, ColumnsType, ColumnType } from 'antd/lib/table';
import { useMemo } from 'react';
import { PORTAL_DEFAULT_PAGINATION_SIZE } from '../core/config';
import { Dictionary } from '../core/interfaces';
import { isEqualArrays } from '../utils/array-utils';

export type DataTableDataIndex = string | number | readonly (string | number)[];

export type DataTablePaginationState = TablePaginationConfig;

export interface DataTableSorter {
	order: 'descend' | 'ascend';
	dataIndex: DataTableDataIndex;
}

export interface DataTableChangeEvent<S extends Dictionary = Dictionary> {
	pagination?: DataTablePaginationState;
	sorters?: DataTableSorter[];
	search?: S;
}

export interface DataTableState<T, S extends Dictionary = Dictionary> extends DataTableChangeEvent<S> {
	dataSource?: T[];
}

export interface DataTableProps<T, S extends Dictionary = Dictionary>
	extends Omit<TableProps<T>, 'onChange' | 'pagination'> {
	onChange?: (e: DataTableChangeEvent<S>) => void;
	pagination?: TablePaginationConfig;
	sorters?: DataTableSorter[];
	search?: S;
}

function isColumnGroupType<T>(col: ColumnGroupType<T> | ColumnType<T>): col is ColumnGroupType<T> {
	return (col as any).children != null;
}

function isEqualsColumnDataIndex(
	a: DataTableDataIndex | null | undefined,
	b: DataTableDataIndex | null | undefined,
): boolean {
	if (Array.isArray(a) && Array.isArray(b)) {
		return isEqualArrays(a, b);
	}

	return a === b;
}

export default function useDataTable<T, S extends Dictionary = Dictionary>({
	rowKey = 'id',
	size = 'middle',
	bordered = true,
	scroll = { x: 800 },
	columns: _columns,
	pagination: _pagination,
	sorters,
	onChange,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	search: _search,
	...props
}: DataTableProps<T, S>): TableProps<T> {
	const columns = useMemo((): ColumnsType<T> | undefined => {
		const sorts = sorters || [];

		const formatColumns = (cols: ColumnsType<T>): ColumnsType<T> => {
			return cols.map((col) => {
				if (isColumnGroupType(col)) {
					return col.children.length > 0 ? { ...col, children: formatColumns(col.children) } : col;
				}

				const newColumn: ColumnType<T> = {
					...col,
				};

				const dataIndex = col.dataIndex;

				if (col.sorter === true) {
					const idx = sorts.findIndex((sort) => isEqualsColumnDataIndex(sort.dataIndex, dataIndex));

					newColumn.sortOrder = idx >= 0 ? sorts[idx].order : undefined;
				}

				return newColumn;
			});
		};

		return _columns != null ? formatColumns(_columns) : _columns;
	}, [_columns, sorters]);

	const pagination = useMemo((): DataTablePaginationState | undefined => {
		if (!_pagination) {
			return;
		}

		return {
			current: 1,
			pageSize: PORTAL_DEFAULT_PAGINATION_SIZE,
			pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
			total: 0,
			showSizeChanger: false,
			showTotal: (total) => `共 ${total} 条数据`,
			size: 'default',
			..._pagination,
		};
	}, [_pagination]);

	return {
		...props,
		rowKey,
		size,
		bordered,
		scroll,
		columns,
		pagination: pagination || false,
		onChange: (pagination, filters, sorter) => {
			if (!onChange) {
				return;
			}

			let newPagination: DataTablePaginationState | undefined;
			const newSorters: DataTableSorter[] = [];

			if (Object.keys(pagination).length > 0) {
				const { current, pageSize, total } = pagination;

				newPagination = {
					current: current || 1,
					pageSize: pageSize || pagination.pageSize || PORTAL_DEFAULT_PAGINATION_SIZE,
					total,
					...pagination,
				};
			}

			for (const s of Array.isArray(sorter) ? sorter : [sorter]) {
				const dataIndex = s.column?.dataIndex;

				if (dataIndex != null) {
					newSorters.push({
						dataIndex,
						order: s.order === 'descend' ? 'descend' : 'ascend',
					});
				}
			}

			onChange({
				sorters: newSorters.length > 0 ? newSorters : [],
				pagination: newPagination,
			});
		},
	};
}

export function mergeDataTableEvents<S extends Dictionary = Dictionary>(
	...events: Array<DataTableChangeEvent<S> | undefined | null>
): DataTableChangeEvent<S> {
	let newPage: DataTablePaginationState | undefined;
	let newSorters: DataTableSorter[] | undefined;
	let newSearch: S | undefined;

	for (const event of events) {
		if (event == null) {
			continue;
		}

		if (event.pagination != null) {
			newPage = { ...newPage, ...event.pagination };
		}

		if (event.sorters != null) {
			newSorters = event.sorters;
		}

		if (event.search != null) {
			newSearch = event.search;
		}
	}

	return { pagination: newPage, sorters: newSorters, search: newSearch };
}
