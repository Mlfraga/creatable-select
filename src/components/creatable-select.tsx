import { Ref, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DynamicSelectProps {
  placeholder?: string;
  options: Option[];
  onCreateOption?: (value: string) => Promise<void>;
  sizeVariant?: "sm" | "md" | "lg";
  label?: string;
  creatable?: boolean;
  creatableText?: string;
  searchOrCreateInputPlaceholder?: string;
  selectOrCreateMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValues?: string[];
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

const DynamicSelect = ({
  placeholder = "Seleione uma opção",
  creatableText = "Create",
  searchOrCreateInputPlaceholder = "Pesquisar ou criar novo item",
  selectOrCreateMessage = "Selecione um item ou crie um novo",
  sizeVariant = "lg",
  options,
  onCreateOption,
  label,
  creatable = false,
  value,
  onChange = (_value: string) => {},
  defaultValues = [],
}: DynamicSelectProps) => {
  const searchOrCreateInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<HTMLDivElement[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
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
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          className={twMerge(
            "shadow appearance-none border",
            "rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-secondary-500 focus:border-transparent text-sm",
            "inline-flex gap-[5px]",
            sizeClasses[sizeVariant]
          )}
          aria-label={label}
          onClick={() => handleOpenChange(!isOpen)}
        >
          <span>{selectedOptionLabel ?? placeholder}</span>
        </button>

        {isOpen && (
          <div className="z-20 flex flex-1 flex-col max-h-[400px] absolute top-0 left-0 w-full gap-2 bg-gray-100/60 backdrop-blur pb-4 border-gray-400 border rounded">
            <input
              ref={searchOrCreateInputRef}
              type="text"
              className="w-full px-4 p-2 bg-white border-none rounded text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-transparent focus:border-transparent"
              placeholder={searchOrCreateInputPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <div className="flex px-6 w-full">
              <span className="text-sm text-gray-500 font-semibold">
                {selectOrCreateMessage}
              </span>
            </div>

            <section className="w-full gap-2 px-4 overflow-auto">
              {filteredOptions.map(({ value: optionValue, label }, index) => (
                <div
                  key={optionValue}
                  ref={
                    optionRefs.current[index] as any as
                      | Ref<HTMLDivElement>
                      | undefined
                  }
                  className={twMerge(
                    "cursor-pointer font-inter duration-150 transition-colors hover:bg-white/50 p-3 py-1 border border-gray-300 rounded-sm bg-white focus-visible:bg-white",
                    optionValue === value && "bg-white",
                    index === 0 ? "mt-0" : "mt-2",
                    highlightedIndex === index && "bg-gray-200"
                  )}
                  onClick={() => handleSelectItem(optionValue)}
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {label}
                  </span>
                </div>
              ))}

              {filteredOptions.length < 1 && creatable && (
                <button
                  type="button"
                  className="flex items-start justify-start p-2 w-full bg-gray-50 text-gray-600 border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 hover:bg-white transition-colors duration-150"
                  onClick={handleCreateNewOption}
                >
                  <span className="font-inter text-sm font">
                    {`${creatableText}`} <b>{`"${searchValue}"`}</b>
                  </span>
                </button>
              )}
            </section>
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
