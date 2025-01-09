"use client";
import DynamicSelect from "@/components/creatable-select";
import { useState } from "react";

const PROGRAMMING_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "typescript", label: "TypeScript" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
];

export default function Home() {
  const [selectedTechnology, setSelectedTechnology] = useState<string>();
  const [programmingLanguages, setProgrammingLanguages] = useState(
    PROGRAMMING_LANGUAGES
  );

  const handleChangeTechnology = (value: string) => {
    setSelectedTechnology(value);
  };

  const handleCreateTechnology = async (technology: string) => {
    const technologySlug = technology.toLowerCase();

    setProgrammingLanguages((prev) => [
      ...prev,
      { value: technologySlug, label: technology },
    ]);

    setSelectedTechnology(technologySlug);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="flex items-center flex-col text-center gap-6 py-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-neutral-800 font-bold tracking-tight">
              Creatable select component
            </h1>
            <p className="text-gray-500 mt-1">assembled with tailwind</p>
          </div>

          {/* GitHub Button */}
          <a
            href="https://github.com/yourusername/dynamic-select"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 border rounded-md bg-neutral-950 hover:bg-neutral-700 text-white hover:text-white transition-colors duration-75"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </a>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <DynamicSelect
              options={programmingLanguages}
              placeholder="Choose programming languages"
              onChange={handleChangeTechnology}
              onCreateOption={handleCreateTechnology}
              value={selectedTechnology}
              creatable
              searchable
              label="Programming Languages"
              creatableText="Add language"
              searchOrCreateInputPlaceholder="Search languages or create newsdfsd..."
            />

            <button
              type="submit"
              className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
