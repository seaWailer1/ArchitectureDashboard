import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

// WCAG AAA Enhanced Form Components

interface WCAGInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  success?: string;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

export const WCAGInput = forwardRef<HTMLInputElement, WCAGInputProps>(
  ({ 
    className, 
    label, 
    error, 
    description, 
    success,
    showPasswordToggle = false,
    containerClassName,
    type = 'text',
    id,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const successId = success ? `${inputId}-success` : undefined;
    const [showPassword, setShowPassword] = React.useState(false);

    const actualType = showPasswordToggle && type === 'password' ? 
      (showPassword ? 'text' : 'password') : type;

    const describedBy = [descriptionId, errorId, successId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-aaa-normal font-semibold text-foreground leading-tight"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-destructive font-bold" aria-label="required field">
              *
            </span>
          )}
        </label>
        
        {description && (
          <p id={descriptionId} className="text-aaa-small text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={cn(
              'flex h-12 w-full rounded-md border-2 bg-background px-4 py-3',
              'text-aaa-normal font-medium text-foreground placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors duration-200',
              error 
                ? 'border-destructive focus-visible:ring-destructive' 
                : success
                ? 'border-success focus-visible:ring-success'
                : 'border-input focus-visible:border-primary',
              showPasswordToggle && 'pr-12',
              className
            )}
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 touch-aaa rounded-md p-1 
                         text-muted-foreground hover:text-foreground focus-aaa"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <div id={errorId} className="flex items-start gap-2 text-destructive" role="alert">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-aaa-small font-medium leading-relaxed">{error}</p>
          </div>
        )}
        
        {success && !error && (
          <div id={successId} className="flex items-start gap-2 text-success">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-aaa-small font-medium leading-relaxed">{success}</p>
          </div>
        )}
      </div>
    );
  }
);

WCAGInput.displayName = 'WCAGInput';

// WCAG AAA Enhanced Select Component
interface WCAGSelectProps {
  label: string;
  error?: string;
  description?: string;
  success?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  id?: string;
}

export const WCAGSelect: React.FC<WCAGSelectProps> = ({
  label,
  error,
  description,
  success,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  containerClassName,
  id
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error ? `${selectId}-error` : undefined;
  const descriptionId = description ? `${selectId}-description` : undefined;
  const successId = success ? `${selectId}-success` : undefined;

  const describedBy = [descriptionId, errorId, successId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <label
        htmlFor={selectId}
        className="block text-aaa-normal font-semibold text-foreground leading-tight"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive font-bold" aria-label="required field">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-aaa-small text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      
      <select
        id={selectId}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'flex h-12 w-full rounded-md border-2 bg-background px-4 py-3',
          'text-aaa-normal font-medium text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          error 
            ? 'border-destructive focus-visible:ring-destructive' 
            : success
            ? 'border-success focus-visible:ring-success'
            : 'border-input focus-visible:border-primary'
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div id={errorId} className="flex items-start gap-2 text-destructive" role="alert">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-aaa-small font-medium leading-relaxed">{error}</p>
        </div>
      )}
      
      {success && !error && (
        <div id={successId} className="flex items-start gap-2 text-success">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-aaa-small font-medium leading-relaxed">{success}</p>
        </div>
      )}
    </div>
  );
};

// WCAG AAA Enhanced Textarea Component
interface WCAGTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
  success?: string;
  characterLimit?: number;
  containerClassName?: string;
}

export const WCAGTextarea = forwardRef<HTMLTextAreaElement, WCAGTextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    description, 
    success,
    characterLimit,
    containerClassName,
    id,
    value,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const descriptionId = description ? `${textareaId}-description` : undefined;
    const successId = success ? `${textareaId}-success` : undefined;
    const characterCountId = characterLimit ? `${textareaId}-character-count` : undefined;

    const describedBy = [descriptionId, errorId, successId, characterCountId].filter(Boolean).join(' ') || undefined;
    const currentLength = typeof value === 'string' ? value.length : 0;
    const isNearLimit = characterLimit && currentLength > characterLimit * 0.8;
    const isOverLimit = characterLimit && currentLength > characterLimit;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label
          htmlFor={textareaId}
          className="block text-aaa-normal font-semibold text-foreground leading-tight"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-destructive font-bold" aria-label="required field">
              *
            </span>
          )}
        </label>
        
        {description && (
          <p id={descriptionId} className="text-aaa-small text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          className={cn(
            'flex min-h-[120px] w-full rounded-md border-2 bg-background px-4 py-3',
            'text-aaa-normal font-medium text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-vertical transition-colors duration-200',
            error || isOverLimit
              ? 'border-destructive focus-visible:ring-destructive' 
              : success
              ? 'border-success focus-visible:ring-success'
              : 'border-input focus-visible:border-primary',
            className
          )}
          aria-describedby={describedBy}
          aria-invalid={error || isOverLimit ? 'true' : 'false'}
          {...props}
        />
        
        {characterLimit && (
          <div 
            id={characterCountId}
            className={cn(
              "text-right text-aaa-small",
              isOverLimit 
                ? "text-destructive font-semibold" 
                : isNearLimit 
                ? "text-warning font-medium"
                : "text-muted-foreground"
            )}
            aria-live="polite"
          >
            {currentLength}/{characterLimit} characters
            {isOverLimit && (
              <span className="block text-destructive font-semibold">
                Character limit exceeded
              </span>
            )}
          </div>
        )}
        
        {error && (
          <div id={errorId} className="flex items-start gap-2 text-destructive" role="alert">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-aaa-small font-medium leading-relaxed">{error}</p>
          </div>
        )}
        
        {success && !error && !isOverLimit && (
          <div id={successId} className="flex items-start gap-2 text-success">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-aaa-small font-medium leading-relaxed">{success}</p>
          </div>
        )}
      </div>
    );
  }
);

WCAGTextarea.displayName = 'WCAGTextarea';

// WCAG AAA Enhanced Checkbox Component
interface WCAGCheckboxProps {
  label: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
}

export const WCAGCheckbox: React.FC<WCAGCheckboxProps> = ({
  label,
  description,
  error,
  checked = false,
  onChange,
  required = false,
  disabled = false,
  id,
  containerClassName
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const descriptionId = description ? `${checkboxId}-description` : undefined;

  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'mt-1 h-5 w-5 rounded border-2 transition-colors touch-aaa',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error 
              ? 'border-destructive text-destructive focus-visible:ring-destructive' 
              : 'border-input text-primary focus-visible:border-primary'
          )}
        />
        <div className="flex-1">
          <label
            htmlFor={checkboxId}
            className="block text-aaa-normal font-medium text-foreground leading-tight cursor-pointer"
          >
            {label}
            {required && (
              <span className="ml-1 text-destructive font-bold" aria-label="required field">
                *
              </span>
            )}
          </label>
          
          {description && (
            <p id={descriptionId} className="mt-1 text-aaa-small text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <div id={errorId} className="flex items-start gap-2 text-destructive ml-8" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-aaa-small font-medium leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
};