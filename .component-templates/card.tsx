import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const {{NAME_LOWER}}Variants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "shadow-md hover:shadow-lg",
        outlined: "border-2 border-primary/20",
        ghost: "border-transparent shadow-none",
        gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10",
      },
      size: {
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface {{NAME}}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {{NAME_LOWER}}Variants> {
  children?: React.ReactNode;
}

const {{NAME}} = forwardRef<HTMLDivElement, {{NAME}}Props>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn({{NAME_LOWER}}Variants({ variant, size, interactive, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

{{NAME}}.displayName = "{{NAME}}";

const {{NAME}}Header = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
{{NAME}}Header.displayName = "{{NAME}}Header";

const {{NAME}}Title = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
{{NAME}}Title.displayName = "{{NAME}}Title";

const {{NAME}}Description = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
{{NAME}}Description.displayName = "{{NAME}}Description";

const {{NAME}}Content = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
{{NAME}}Content.displayName = "{{NAME}}Content";

const {{NAME}}Footer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
{{NAME}}Footer.displayName = "{{NAME}}Footer";

export {
  {{NAME}},
  {{NAME}}Header,
  {{NAME}}Title,
  {{NAME}}Description,
  {{NAME}}Content,
  {{NAME}}Footer,
  {{NAME_LOWER}}Variants,
};
