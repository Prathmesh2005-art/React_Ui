import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Eye, EyeOff, X, ChevronUp, ChevronDown, Users, Database } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Editor',
    status: 'inactive',
    createdAt: '2024-01-17',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-01-18',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-19',
  },
];

const InputField = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  showClearButton = false, 
  showPasswordToggle = false,
  helperText = '',
  errorMessage = '',
  invalid = false,
  disabled = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  className = '',
  isDarkMode = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    relative w-full transition-all duration-300 ease-in-out
    ${size === 'sm' ? 'px-3 py-2 text-sm' : size === 'lg' ? 'px-4 py-3 text-lg' : 'px-4 py-2.5'}
    ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-text'}
    ${invalid ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' : ''}
    ${loading ? 'animate-pulse' : ''}
  `;

  const getVariantClasses = () => {
    if (variant === 'filled') {
      return `
        ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900'} 
        border border-transparent rounded-lg
        focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
        ${isHovered && !disabled ? 'bg-white shadow-lg transform scale-105' : ''}
      `;
    } else if (variant === 'ghost') {
      return `
        bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg
        ${isDarkMode ? 'text-white' : 'text-gray-900'}
        focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20
        ${isHovered && !disabled ? 'border-purple-400 shadow-lg transform scale-105' : ''}
      `;
    } else {
      return `
        ${isDarkMode ? 'bg-white text-gray-900' : 'bg-white text-gray-900'} 
        border-2 border-gray-300 dark:border-gray-600 rounded-lg
        focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
        ${isHovered && !disabled ? 'border-blue-400 shadow-lg transform scale-105' : ''}
      `;
    }
  };

  const popupEffect = isFocused || isHovered ? 'transform -translate-y-1 scale-105 shadow-2xl z-20' : '';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
          ${isFocused ? (isDarkMode ? 'text-blue-300' : 'text-blue-600') : ''}
        `}>
          {label}
        </label>
      )}
      
      <div 
        className={`
          relative transition-all duration-300 ease-in-out
          ${popupEffect}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseClasses} ${getVariantClasses()} pr-12`}
          {...props}
        />
        
        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          
          {showClearButton && value && (
            <button
              type="button"
              onClick={() => onChange({ target: { value: '' } })}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:scale-110"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {helperText && !errorMessage && (
        <p className={`mt-1 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
      
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500 animate-pulse">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

const DataTable = ({ data, columns, loading, selectable, onRowSelect, emptyMessage, isDarkMode }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowSelect = (row) => {
    const newSelection = selectedRows.includes(row.id)
      ? selectedRows.filter(id => id !== row.id)
      : [...selectedRows, row.id];
    
    setSelectedRows(newSelection);
    onRowSelect?.(data.filter(item => newSelection.includes(item.id)));
  };

  if (loading) {
    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        rounded-xl border shadow-sm p-8
      `}>
        <div className="animate-pulse">
          <div className="flex space-x-4 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="flex space-x-4 mb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        rounded-xl border shadow-sm p-8 text-center
      `}>
        <Database className={`mx-auto h-12 w-12 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {emptyMessage || 'No data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        rounded-xl border shadow-sm overflow-hidden
      `}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = data.map(row => row.id);
                          setSelectedRows(allIds);
                          onRowSelect?.(data);
                        } else {
                          setSelectedRows([]);
                          onRowSelect?.([]);
                        }
                      }}
                      checked={selectedRows.length === data.length}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && handleSort(column.dataIndex)}
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}
                      ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            size={12} 
                            className={`${
                              sortConfig.key === column.dataIndex && sortConfig.direction === 'asc'
                                ? 'text-blue-500' 
                                : 'text-gray-400'
                            } transition-colors duration-200`}
                          />
                          <ChevronDown 
                            size={12} 
                            className={`${
                              sortConfig.key === column.dataIndex && sortConfig.direction === 'desc'
                                ? 'text-blue-500' 
                                : 'text-gray-400'
                            } transition-colors duration-200`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
              {sortedData.map((row) => (
                <tr
                  key={row.id}
                  className={`
                    transition-all duration-200 hover:scale-[1.01] cursor-pointer
                    ${selectedRows.includes(row.id) 
                      ? (isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/40' : 'bg-blue-50 hover:bg-blue-100') 
                      : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                    }
                  `}
                  onClick={() => selectable && handleRowSelect(row)}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render ? (
                        <div className="transition-all duration-200 hover:scale-105">
                          {column.render(row[column.dataIndex], row)}
                        </div>
                      ) : (
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                          {row[column.dataIndex]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      render: (value) => (
        <div className={`
          p-2 rounded-lg transition-all duration-300 hover:shadow-md
          ${isDarkMode ? 'hover:bg-blue-800/30' : 'hover:bg-blue-100'}
          hover:scale-105 cursor-pointer
        `}>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      render: (value) => (
        <div className={`
          p-2 rounded-lg transition-all duration-300 hover:shadow-md
          ${isDarkMode ? 'hover:bg-emerald-800/30' : 'hover:bg-emerald-100'}
          hover:scale-105 cursor-pointer
        `}>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      render: (value) => (
        <div className={`
          p-2 rounded-lg transition-all duration-300 hover:shadow-md
          ${isDarkMode ? 'hover:bg-purple-800/30' : 'hover:bg-purple-100'}
          hover:scale-105 cursor-pointer
        `}>
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`
            inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-110 cursor-pointer
            ${value === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70'
              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/70'
            }
          `}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      sortable: true,
      render: (value) => (
        <div className={`
          p-2 rounded-lg transition-all duration-300 hover:shadow-md
          ${isDarkMode ? 'hover:bg-amber-800/30' : 'hover:bg-amber-100'}
          hover:scale-105 cursor-pointer
        `}>
          <span>{value}</span>
        </div>
      ),
    },
  ];

  return (
    <div className={`
      min-h-screen transition-all duration-500 py-8 px-4 sm:px-6 lg:px-8
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }
    `}>
      <div className="max-w-7xl mx-auto">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`
            fixed top-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300
            ${isDarkMode 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-yellow-400/25' 
              : 'bg-slate-700 text-white hover:bg-slate-600 hover:shadow-slate-700/25'
            }
            hover:scale-110 hover:shadow-2xl
          `}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`
            text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            React Components Demo
          </h1>
          <p className={`
            text-lg md:text-xl transition-colors duration-500
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            Interactive demo with professional animations and responsive design
          </p>
        </div>

        {/* InputField Section */}
        <div className={`
          rounded-2xl shadow-2xl p-6 md:p-8 mb-12 border transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl
          ${isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
          }
        `}>
          <div className="flex items-center mb-8">
            <Users className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
            <h2 className={`
              text-2xl md:text-3xl font-bold transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>
              InputField Component Demo
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <InputField
                label="Search Users"
                placeholder="Type to search users..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                showClearButton
                helperText="Search by name or email"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                variant="filled"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                showPasswordToggle
                variant="outlined"
                size="lg"
                isDarkMode={isDarkMode}
              />
            </div>

            <div className="space-y-8">
              <InputField
                label="Loading Example"
                placeholder="Loading..."
                loading
                value="Processing..."
                onChange={() => {}}
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Error Example"
                placeholder="Enter valid data"
                value="invalid-input"
                onChange={() => {}}
                errorMessage="This input contains invalid data"
                invalid
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Disabled Field"
                placeholder="This field is disabled"
                disabled
                variant="ghost"
                isDarkMode={isDarkMode} value={undefined} onChange={undefined}              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSearch}
              className={`
                px-8 py-3 font-medium rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
                ${isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <Search className="inline mr-2" size={20} />
              Search Users
            </button>
          </div>
        </div>

        {/* DataTable Section */}
        <div className={`
          rounded-2xl shadow-2xl p-6 md:p-8 mb-12 border transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl
          ${isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
          }
        `}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Database className={`mr-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={32} />
              <h2 className={`
                text-2xl md:text-3xl font-bold transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                DataTable Component Demo
              </h2>
            </div>
            {selectedUsers.length > 0 && (
              <div className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}
              `}>
                Selected: {selectedUsers.length} user(s)
              </div>
            )}
          </div>

          <DataTable
            data={filteredUsers}
            columns={columns}
            loading={isLoading}
            selectable
            onRowSelect={setSelectedUsers}
            emptyMessage="No users found. Try adjusting your search."
            isDarkMode={isDarkMode}
          />

          {selectedUsers.length > 0 && (
            <div className={`
              mt-8 p-6 rounded-xl transition-all duration-500
              ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}
            `}>
              <h3 className={`
                font-semibold mb-4 transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Selected Users:
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedUsers.map(user => (
                  <span
                    key={user.id}
                    className={`
                      inline-flex px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 cursor-pointer
                      ${isDarkMode 
                        ? 'bg-blue-800/50 text-blue-300 hover:bg-blue-700/50' 
                        : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                      }
                    `}
                  >
                    {user.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`
            rounded-2xl shadow-2xl p-6 md:p-8 border transition-all duration-500 hover:scale-105 hover:shadow-3xl
            ${isDarkMode 
              ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border-purple-700/50' 
              : 'bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm border-purple-200/50'
            }
          `}>
            <h3 className={`
              text-xl md:text-2xl font-bold mb-6 transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>
              InputField Features
            </h3>
            <ul className={`
              space-y-3 transition-colors duration-500
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Multiple variants: filled, outlined, ghost
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Size options: small, medium, large
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Validation states with error messages
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Loading and disabled states
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Password toggle and clear button
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Full accessibility support
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Dark mode compatible with popup effects
              </li>
            </ul>
          </div>

          <div className={`
            rounded-2xl shadow-2xl p-6 md:p-8 border transition-all duration-500 hover:scale-105 hover:shadow-3xl
            ${isDarkMode 
              ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm border-emerald-700/50' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm border-emerald-200/50'
            }
          `}>
            <h3 className={`
              text-xl md:text-2xl font-bold mb-6 transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>
              DataTable Features
            </h3>
            <ul className={`
              space-y-3 transition-colors duration-500
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Sortable columns with smooth indicators
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Row selection with hover animations
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Loading and empty states with skeleton
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Professional hover effects on cells
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Custom cell rendering with animations
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Fully responsive design
              </li>
              <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                TypeScript support with dark mode
              </li>
            </ul>
          </div>
        </div>


        {/* Footer */}
        <footer className={`
          mt-16 text-center py-8 border-t transition-colors duration-500
          ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}
        `}>
          <p className="text-sm">
            Professional React Components Demo with Advanced Animations
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;