import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from './Input';
import Button from './Button';

export default function Table({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchField = 'name',
  pageSize = 8,
  actions = null,
  emptyMessage = 'No records found'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const val = item[searchField] || '';
    return String(val).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border rounded-2xl overflow-hidden shadow-sm dark:shadow-card-dark">
      {/* Table Toolbar */}
      {(searchable || actions) && (
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-crick-border/70">
          {searchable ? (
            <div className="w-full sm:w-72">
              <Input
                placeholder={searchPlaceholder}
                icon={Search}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 text-xs"
              />
            </div>
          ) : <div />}

          {actions && (
            <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-50 dark:bg-crick-surface/80 text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-crick-textMuted border-b border-slate-200 dark:border-crick-border">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-crick-border/50">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx}
                  className="hover:bg-slate-50 dark:hover:bg-crick-cardHover/60 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-5 py-3.5 align-middle ${col.cellClassName || ''}`}>
                      {col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400 dark:text-crick-textMuted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-crick-border/70 text-xs text-slate-500 dark:text-crick-textMuted">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(startIndex + pageSize, filteredData.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredData.length}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              icon={ChevronLeft}
            >
              Prev
            </Button>
            <span className="px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              icon={ChevronRight}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
