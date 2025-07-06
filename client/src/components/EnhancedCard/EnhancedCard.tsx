import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const enhancedcardVariants = cva(
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

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedcardVariants> {
  children?: React.ReactNode;
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(enhancedcardVariants({ variant, size, interactive, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
  enhancedcardVariants,
};
