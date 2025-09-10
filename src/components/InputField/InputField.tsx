import * as React from 'react';
import { useState, forwardRef } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value = '',
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      loading = false,
      variant = 'outlined',
      size = 'md',
      type = 'text',
      showClearButton = false,
      showPasswordToggle = false,
      className = '',
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value);

    const inputId = label ? `${label.replace(/\s+/g, '-').toLowerCase()}-input` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      setInternalValue('');
      onChange?.(syntheticEvent);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    // Variant classes
    const getVariantClasses = () => {
      const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2';

      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700 focus:ring-blue-500`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none focus:border-blue-500 focus:ring-0`;
        case 'outlined':
        default:
          return `${baseClasses} bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-blue-500`;
      }
    };

    const getStateClasses = () => {
      if (disabled) return 'opacity-50 cursor-not-allowed';
      if (invalid || errorMessage) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
      return '';
    };

    const inputType = showPasswordToggle && type === 'password' && showPassword ? 'text' : type;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={`
              w-full
              ${sizeClasses[size]}
              ${getVariantClasses()}
              ${getStateClasses()}
              ${showClearButton || showPasswordToggle || loading ? 'pr-12' : ''}
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
            `}
            aria-invalid={invalid || !!errorMessage}
            aria-describedby={
              errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
          />

          {/* Icons container */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
            {loading && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}

            {showClearButton && !loading && (value || internalValue) && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {showPasswordToggle && type === 'password' && !loading && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div className="mt-2 text-sm">
            {errorMessage ? (
              <p id={`${inputId}-error`} className="text-red-600 dark:text-red-400" role="alert">
                {errorMessage}
              </p>
            ) : (
              <p id={`${inputId}-helper`} className="text-gray-600 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
