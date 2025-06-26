import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// WCAG AAA Skip Navigation Component
export const SkipNav = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 
                 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground 
                 focus:rounded-br-md focus:font-semibold focus:text-aaa-normal
                 focus:no-underline focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

// AAA Compliant Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'min-h-[44px] min-w-[44px] px-3 py-2 text-sm',
      md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base',
      lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg'
    };

    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      ghost: 'bg-transparent border-2 border-neutral-300 text-foreground hover:bg-neutral-100 focus-visible:ring-neutral-600'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-semibold transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-60',
          'text-aaa-normal leading-tight',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        <span className={loading ? 'sr-only' : undefined}>
          {loading ? 'Loading...' : children}
        </span>
        {loading && <span aria-live="polite" className="sr-only">Loading, please wait</span>}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// AAA Compliant Link Component
interface AccessibleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  children: React.ReactNode;
}

export const AccessibleLink = forwardRef<HTMLAnchorElement, AccessibleLinkProps>(
  ({ className, external, children, href, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'text-primary underline-offset-4 hover:underline focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'rounded-sm min-h-[44px] min-w-[44px] inline-flex items-center',
          'text-aaa-normal font-medium',
          className
        )}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': `${children} (opens in new window)`
        })}
        {...props}
      >
        {children}
        {external && (
          <span className="ml-1 text-sm" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    );
  }
);

AccessibleLink.displayName = 'AccessibleLink';

// AAA Compliant Input Component
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ className, label, error, description, id, type = 'text', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-aaa-normal font-semibold text-foreground"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-destructive" aria-label="required">
              *
            </span>
          )}
        </label>
        
        {description && (
          <p id={descriptionId} className="text-aaa-small text-muted-foreground">
            {description}
          </p>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2',
            'text-aaa-normal placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {error && (
          <p id={errorId} className="text-aaa-small text-destructive font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

// AAA Compliant Heading Component
interface AccessibleHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const AccessibleHeading = forwardRef<HTMLHeadingElement, AccessibleHeadingProps>(
  ({ className, level, children, ...props }, ref) => {
    const sizeClasses = {
      1: 'text-4xl font-bold text-aaa-large',
      2: 'text-3xl font-bold text-aaa-large', 
      3: 'text-2xl font-semibold text-aaa-large',
      4: 'text-xl font-semibold text-aaa-normal',
      5: 'text-lg font-semibold text-aaa-normal',
      6: 'text-base font-semibold text-aaa-normal'
    };

    const HeadingComponent = ({ children, className, ...headingProps }: any) => {
      const headingClasses = cn(
        'text-foreground leading-tight mb-4',
        sizeClasses[level],
        className
      );
      
      switch (level) {
        case 1: return <h1 ref={ref} className={headingClasses} {...headingProps}>{children}</h1>;
        case 2: return <h2 ref={ref} className={headingClasses} {...headingProps}>{children}</h2>;
        case 3: return <h3 ref={ref} className={headingClasses} {...headingProps}>{children}</h3>;
        case 4: return <h4 ref={ref} className={headingClasses} {...headingProps}>{children}</h4>;
        case 5: return <h5 ref={ref} className={headingClasses} {...headingProps}>{children}</h5>;
        case 6: return <h6 ref={ref} className={headingClasses} {...headingProps}>{children}</h6>;
        default: return <h1 ref={ref} className={headingClasses} {...headingProps}>{children}</h1>;
      }
    };

    return <HeadingComponent className={className} {...props}>{children}</HeadingComponent>;
  }
);

AccessibleHeading.displayName = 'AccessibleHeading';

// Live Region for Dynamic Content Updates
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ 
  children, 
  politeness = 'polite', 
  atomic = false 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Focus Trap Component for Modals
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active = true }) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !trapRef.current) return;

    const trap = trapRef.current;
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    trap.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={trapRef}>
      {children}
    </div>
  );
};

// Status Message Component
interface StatusMessageProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ 
  children, 
  type = 'info', 
  className 
}) => {
  const typeClasses = {
    success: 'bg-success/10 text-success border-success',
    error: 'bg-destructive/10 text-destructive border-destructive',
    warning: 'bg-warning/10 text-warning border-warning',
    info: 'bg-info/10 text-info border-info'
  };

  const typeLabels = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  };

  return (
    <div
      className={cn(
        'rounded-md border-l-4 p-4 text-aaa-normal font-medium',
        typeClasses[type],
        className
      )}
      role="alert"
      aria-label={typeLabels[type]}
    >
      <span className="sr-only">{typeLabels[type]}:</span>
      {children}
    </div>
  );
};

// Progress Indicator Component
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export const AccessibleProgress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  label,
  showValue = false 
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-aaa-normal font-medium">{label}</span>
          {showValue && (
            <span className="text-aaa-small text-muted-foreground">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className="h-3 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};