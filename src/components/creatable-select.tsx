"use client";
import { Ref, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DynamicSelectProps {
  // Core functionality
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onCreateOption?: (value: string) => Promise<void>;
  defaultValues?: string[];

  // Customization
  sizeVariant?: "sm" | "md" | "lg";
  className?: string;
  inputClassName?: string;
  optionClassName?: string;
  containerClassName?: string;

  // Labels & Text
  label?: string;
  placeholder?: string;
  creatableText?: string;
  searchOrCreateInputPlaceholder?: string;
  selectOrCreateMessage?: string;
  loadingMessage?: string;

  // Features
  creatable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchable?: boolean;

  // Render props for customization
  renderOption?: (option: Option) => React.ReactNode;
  renderCreateOption?: (inputValue: string) => React.ReactNode;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

const DynamicSelect = ({
  // Core functionality
  placeholder = "Select an option",
  options,
  value,
  onChange = () => {},
  onCreateOption,
  defaultValues = [],

  // Customization
  sizeVariant = "md",
  className,
  inputClassName,
  optionClassName,
  containerClassName,

  // Labels & Text
  label,
  creatableText = "Create",
  searchOrCreateInputPlaceholder = "Search or create",
  selectOrCreateMessage = "Select an item or create new",
  loadingMessage = "Loading options...",
  // Features
  creatable = false,
  disabled = false,
  loading = false,
  searchable = true,
  clearable = false,

  // Custom renders
  renderOption,
  renderCreateOption,
}: DynamicSelectProps) => {
  const searchOrCreateInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<HTMLDivElement[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  useEffect(() => {
    setLoadingOptions(true);

    const debounce = setTimeout(() => {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

      setLoadingOptions(false);
      clearTimeout(debounce);
    }, 1000);

    searchOrCreateInputRef.current?.focus();

    return () => clearTimeout(debounce);
  }, [searchValue, options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev === null || prev === filteredOptions.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) =>
          prev === null || prev === 0 ? filteredOptions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && highlightedIndex !== null) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex, onChange]);

  useEffect(() => {
    if (highlightedIndex !== null && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  const handleSelectItem = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      setTimeout(() => {
        searchOrCreateInputRef.current?.focus();
      }, 100);
    }
  };

  const handleCreateNewOption = async () => {
    setSearchValue("");

    if (onCreateOption) {
      await onCreateOption(searchValue);
    }

    setIsOpen(false);
  };

  const selectedOptionLabel = useMemo(() => {
    return options.find((option) => option.value === value)?.label;
  }, [options, value, defaultValues]);

  return (
    <div className={twMerge("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label
          className={twMerge(
            "block text-sm font-medium leading-6 text-gray-900",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          className={twMerge(
            "shadow appearance-none border",
            "rounded w-full px-3 py-2 text-gray-700 leading-tight",
            "focus:outline-none focus:ring-1 focus:ring-secondary-500 focus:border-transparent",
            "text-sm inline-flex gap-[5px]",
            disabled && "opacity-50 cursor-not-allowed",
            sizeClasses[sizeVariant],
            className
          )}
          onClick={() => !disabled && handleOpenChange(!isOpen)}
        >
          <span>{selectedOptionLabel ?? placeholder}</span>

          {loading && <span className="loading-spinner" />}
        </button>

        {isOpen && (
          <div
            className={twMerge(
              "z-20 flex flex-1 flex-col max-h-[400px]",
              "absolute top-0 left-0 w-full gap-2",
              "bg-white shadow-lg p-4",
              "border-zinc-200 border rounded"
            )}
          >
            {searchable && (
              <input
                ref={searchOrCreateInputRef}
                type="text"
                className={twMerge(
                  "w-full px-4 p-2 bg-white border  rounded",
                  "text-sm text-gray-600 placeholder-gray-400",
                  "focus:outline-none focus:ring-1 focus:ring-transparent",
                  inputClassName
                )}
                placeholder={searchOrCreateInputPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            )}

            <span className="text-sm text-neutral-600 font-semibold mt-2 ml-1">
              {selectOrCreateMessage}
            </span>

            <section
              className={twMerge(
                "w-full gap-2 overflow-auto max-h-[250px] pr-2 relative",
                // Custom Scrollbar Styles using native CSS
                "[&::-webkit-scrollbar]:w-2",
                "[&::-webkit-scrollbar-track]:bg-gray-100",
                "[&::-webkit-scrollbar-track]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:bg-gray-400",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:border-1",
                "[&::-webkit-scrollbar-thumb]:border-gray-100",
                "hover:[&::-webkit-scrollbar-thumb]:bg-gray-400",
                // Firefox scrollbar styles
                "scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
              )}
            >
              {filteredOptions.map(({ value: optionValue, label }, index) => (
                <div
                  key={optionValue}
                  ref={
                    optionRefs.current[index] as any as
                      | Ref<HTMLDivElement>
                      | undefined
                  }
                  className={twMerge(
                    "cursor-pointer font-inter duration-150 transition-colors",
                    "hover:bg-gray-50 p-2 py-1 border border-gray-200",
                    "rounded-md bg-white focus-visible:bg-white",
                    optionValue === value && "bg-gray-50 border-gray-300",
                    index === 0 ? "mt-0" : "mt-2",
                    highlightedIndex === index && "bg-gray-50 border-gray-300"
                  )}
                  onClick={() => handleSelectItem(optionValue)}
                >
                  <span className="text-sm text-neutral-600 font-medium">
                    {label}
                  </span>
                </div>
              ))}

              {filteredOptions.length < 1 && creatable && searchValue.length > 0 && (
                <button
                  type="button"
                  className={twMerge(
                    "flex items-start justify-start p-3 w-full",
                    "bg-neutral-50 text-neutral-600 border border-neutral-300",
                    "rounded-md focus:outline-none focus:ring-2",
                    "focus:ring-gray-300 focus:ring-opacity-50",
                    "hover:bg-neutral-100 transition-colors duration-150"
                  )}
                  onClick={handleCreateNewOption}
                >
                  <span className="font-inter text-sm">
                    {`${creatableText}`} <b>{`"${searchValue}"`}</b>
                  </span>
                </button>
              )}
            </section>

            {loadingOptions && (
              <div 
                className={twMerge(
                  "absolute inset-0 bg-white/60 backdrop-blur-[1px]",
                  "flex items-center justify-center"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span className="text-sm text-gray-600">{loadingMessage}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="z-10 w-screen h-screen fixed top-0 left-0"
          onClick={() => handleOpenChange(false)}
        />
      )}
    </div>
  );
};

export default DynamicSelect;
