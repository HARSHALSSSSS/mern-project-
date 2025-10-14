// Reusable Data Table Component
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useState } from 'react';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  emptyMessage = 'No data available',
  showActions = true 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-neutral-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="inline ml-1 text-accent-600" />
      : <FaSortDown className="inline ml-1 text-accent-600" />;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="text-neutral-500 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-neutral-500 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-neutral-200' : ''
                  }`}
                >
                  {col.label}
                  {col.sortable !== false && getSortIcon(col.key)}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {currentData.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-neutral-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-primary-700 font-medium">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="text-primary-600 hover:text-primary-800 inline-flex items-center"
                        title="View"
                      >
                        <FaEye />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-accent-600 hover:text-accent-800 inline-flex items-center"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-error-500 hover:text-error-700 inline-flex items-center"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-t border-neutral-200">
          <div className="text-sm text-primary-700 font-medium">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-xl font-medium ${
                currentPage === 1
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-white text-primary-700 hover:bg-neutral-100 border-neutral-300'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-xl font-medium ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white border-accent-600'
                    : 'bg-white text-primary-700 hover:bg-neutral-100 border-neutral-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-xl font-medium ${
                currentPage === totalPages
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-white text-primary-700 hover:bg-neutral-100 border-neutral-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  showActions: PropTypes.bool,
};

export default DataTable;