import * as React from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

/* ---------------------------------- Types ---------------------------------- */
type CreatableSelectContextValue = {
  open: boolean;
  value?: string;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
};

const CreatableSelectContext = createContext<CreatableSelectContextValue | undefined>(undefined);

/* ---------------------------------- Root ---------------------------------- */
interface RootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ children, value, onValueChange, open, onOpenChange, disabled, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string | undefined>(value);

    const handleOpenChange = useCallback((newOpen: boolean) => {
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    }, [onOpenChange]);

    const handleValueChange = useCallback((newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    }, [onValueChange]);

    const contextValue = useMemo(
      () => ({
        open: open ?? internalOpen,
        value: value ?? internalValue,
        disabled,
        onOpenChange: handleOpenChange,
        onValueChange: handleValueChange,
      }),
      [open, internalOpen, value, internalValue, disabled, handleOpenChange, handleValueChange]
    );

    return (
      <CreatableSelectContext.Provider value={contextValue}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </CreatableSelectContext.Provider>
    );
  }
);
Root.displayName = 'CreatableSelect.Root';

/* --------------------------------- Trigger --------------------------------- */
interface TriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, ...props }, ref) => {
    const context = useContext(CreatableSelectContext);
    if (!context) throw new Error('Trigger must be used within CreatableSelect');

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={context.open}
        aria-haspopup="listbox"
        disabled={context.disabled}
        onClick={() => context.onOpenChange(!context.open)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Trigger.displayName = 'CreatableSelect.Trigger';

/* --------------------------------- Content --------------------------------- */
interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, ref) => {
    const context = useContext(CreatableSelectContext);
    if (!context) throw new Error('Content must be used within CreatableSelect');

    if (!context.open) return null;

    return (
      <div
        ref={ref}
        role="listbox"
        {...props}
      >
        {children}
      </div>
    );
  }
);
Content.displayName = 'CreatableSelect.Content';

/* ---------------------------------- Item ---------------------------------- */
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ children, value, ...props }, ref) => {
    const context = useContext(CreatableSelectContext);
    if (!context) throw new Error('Item must be used within CreatableSelect');

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={context.value === value}
        onClick={() => context.onValueChange(value)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Item.displayName = 'CreatableSelect.Item';

/* --------------------------------- Export --------------------------------- */
export const CreatableSelect = {
  Root,
  Trigger,
  Content,
  Item,
};