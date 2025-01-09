# Dynamic Select

**Dynamic Select** is a lightweight, accessible, and fully customizable React component for creating and managing selectable options. Built with **TypeScript** and styled using **Tailwind CSS**, it supports **search functionality**, and **creatable options** — all with **zero dependencies**. Whether you're building a simple form or a complex application, Dynamic Select is here to make your workflow easier.

---

## ✨ Features

- **Creatable Options**: Allow users to create new options on the fly.
- **Search Functionality**: Easily filter options with a search bar.
- **Dark Mode Support**: Easily adapts to your app's theme.
- **Keyboard Navigation**: Full keyboard accessibility for seamless interactions.
- **Zero Dependencies**: Lightweight and minimal setup.
- **TypeScript Support**: Type-safe and developer-friendly.
- **Tailwind CSS Styling**: Easily customizable with utility classes.

---

## 🚀 Usage

Here’s a simple example of how to use the **Dynamic Select** component:

```tsx
import React, { useState } from "react";
import DynamicSelect from "dynamic-select";

const App = () => {
  const [value, setValue] = useState("");

  const handleCreateOption = async (newOption: string) => {
    console.log("New option created:", newOption);
    // Add additional logic here, like updating a database
  };

  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ];

  return (
    <DynamicSelect
      options={options}
      value={value}
      onChange={setValue}
      onCreateOption={handleCreateOption}
      placeholder="Select or create..."
      label="Frameworks"
      creatable
      searchable
      sizeVariant="md"
    />
  );
};

export default App;
```

---

## 🔧 Props

| Prop                 | Type                                      | Description                                  | Default       |
| -------------------- | ----------------------------------------- | -------------------------------------------- | ------------- | ----------------------------------- | ------ |
| `options`            | `Array<{ value: string; label: string }>` | The list of selectable options.              | `[]`          |
| `value`              | `string`                                  | The currently selected value.                | `''`          |
| `onChange`           | `(value: string) => void`                 | Callback fired when the selection changes.   | `undefined`   |
| `onCreateOption`     | `(value: string) => Promise<void>`        | Callback fired when a new option is created. | `undefined`   |
| `placeholder`        | `string`                                  | Placeholder text for the input.              | `"Select..."` |
| `label`              | `string`                                  | Label for the select component.              | `''`          |
| `creatable`          | `boolean`                                 | Enables the ability to create new options.   | `false`       |
| `searchable`         | `boolean`                                 | Enables the search functionality.            | `false`       |
| `disabled`           | `boolean`                                 | Disables the component.                      | `false`       |
| `loading`            | `boolean`                                 | Shows a loading indicator.                   | `false`       |
| `sizeVariant`        | `"sm"                                     | "md"                                         | "lg"`         | Controls the size of the component. | `"md"` |
| `className`          | `string`                                  | Additional classes for the select container. | `''`          |
| `containerClassName` | `string`                                  | Additional classes for the outer container.  | `''`          |
| `inputClassName`     | `string`                                  | Additional classes for the input field.      | `''`          |

---

## 🤝 Contributing

We welcome contributions! Here’s how you can help:

1. **Fork the Repository**:

   - Click the "Fork" button at the top-right corner of this repository.

2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/your-username/dynamic-select.git
   cd dynamic-select
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Submit a Pull Request**:
   - After making your changes, create a pull request to the `main` branch.

---

## 👤 Author

Developed with ❤️ by **Matheus Fraga**.

- [GitHub](https://github.com/Mlfraga)
- [LinkedIn](https://www.linkedin.com/in/matheus-fraga-257628178/)
- [Twitter](https://x.com/FragaSlk)
