import * as React from 'react';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2, Database } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
}

type SortOrder = 'asc' | 'desc' | null;
interface SortState { key: string | null; order: SortOrder }

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className = '',
  emptyMessage = 'No data available',
  pageSize = 10,
  showPagination = true,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortState, setSortState] = useState<SortState>({ key: null, order: null });
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.order) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.key === sortState.key);
      if (!column) return 0;
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];
      if (aValue === bValue) return 0;

      let comparison = 0;
      if (aValue == null) comparison = -1;
      else if (bValue == null) comparison = 1;
      else if (typeof aValue === 'string' && typeof bValue === 'string') comparison = aValue.localeCompare(bValue);
      else comparison = aValue < bValue ? -1 : 1;

      return sortState.order === 'desc' ? -comparison : comparison;
    });
  }, [data, sortState, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Sorting handler
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    setSortState(prev => {
      if (prev.key === column.key) {
        const newOrder = prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc';
        return { key: newOrder ? column.key : null, order: newOrder };
      }
      return { key: column.key, order: 'asc' };
    });
  };

  // Row selection handlers
  const handleRowSelection = (index: number, isSelected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    isSelected ? newSelectedRows.add(index) : newSelectedRows.delete(index);
    setSelectedRows(newSelectedRows);
    onRowSelect?.(Array.from(newSelectedRows).map(idx => sortedData[idx]));
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIndices = new Set(sortedData.map((_, idx) => idx));
      setSelectedRows(allIndices);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortState.key !== column.key) return <div className="w-4 h-4" />;
    return sortState.order === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) return <div className={`w-full ${className}`}><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /><span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span></div></div>;
  if (!data.length) return <div className={`w-full ${className}`}><div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"><Database className="w-12 h-12 mb-4" /><p className="text-lg font-medium">{emptyMessage}</p></div></div>;

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {selectable && <th className="w-12 px-6 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={selectedRows.size === sortedData.length && sortedData.length > 0} onChange={(e) => handleSelectAll(e.target.checked)} aria-label="Select all rows" /></th>}
                {columns.map(col => (
                  <th key={col.key} className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getAlignmentClass(col.align)} ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none' : ''}`} style={{ width: col.width }} onClick={() => handleSort(col)}>
                    <div className="flex items-center space-x-1">
                      <span>{col.title}</span>
                      {getSortIcon(col)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((row, idx) => {
                const originalIndex = sortedData.indexOf(row);
                const isSelected = selectedRows.has(originalIndex);
                return (
                  <tr key={idx} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    {selectable && <td className="px-6 py-4"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={isSelected} onChange={(e) => handleRowSelection(originalIndex, e.target.checked)} aria-label={`Select row ${idx + 1}`} /></td>}
                    {columns.map(col => <td key={col.key} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getAlignmentClass(col.align)}`}>{col.render ? col.render(row[col.dataIndex], row, idx) : String(row[col.dataIndex] ?? '')}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
