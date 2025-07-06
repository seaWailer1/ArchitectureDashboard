import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const demopaymentcardVariants = cva(
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

export interface DemoPaymentCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof demopaymentcardVariants> {
  children?: React.ReactNode;
}

const DemoPaymentCard = forwardRef<HTMLDivElement, DemoPaymentCardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(demopaymentcardVariants({ variant, size, interactive, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DemoPaymentCard.displayName = "DemoPaymentCard";

const DemoPaymentCardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
DemoPaymentCardHeader.displayName = "DemoPaymentCardHeader";

const DemoPaymentCardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
DemoPaymentCardTitle.displayName = "DemoPaymentCardTitle";

const DemoPaymentCardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
DemoPaymentCardDescription.displayName = "DemoPaymentCardDescription";

const DemoPaymentCardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
DemoPaymentCardContent.displayName = "DemoPaymentCardContent";

const DemoPaymentCardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
DemoPaymentCardFooter.displayName = "DemoPaymentCardFooter";

export {
  DemoPaymentCard,
  DemoPaymentCardHeader,
  DemoPaymentCardTitle,
  DemoPaymentCardDescription,
  DemoPaymentCardContent,
  DemoPaymentCardFooter,
  demopaymentcardVariants,
};
