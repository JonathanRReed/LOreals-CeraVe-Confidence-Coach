import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && onOpenChange) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onOpenChange]);

  if (!open) return null;

  return <>{children}</>;
};

const DialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <div
          ref={ref}
          className={cn(
            'relative bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
