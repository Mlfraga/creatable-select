export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CreatableSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onCreateOption?: (value: string) => Promise<void>;
  defaultValues?: string[];
  disabled?: boolean;
  loading?: boolean;
  creatable?: boolean;
  searchable?: boolean;
} 