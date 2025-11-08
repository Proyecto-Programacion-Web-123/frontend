"use client";
import { useState } from "react";

interface FilterSelectProps {
  options: string[];
  defaultOption?: string;
}

export default function FilterSelect({ options, defaultOption }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultOption || options[0]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div
        className="selected"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <span className="arrow">▼</span>
      </div>

      {isOpen && (
        <ul className="options">
          {options.map((option) => (
            <li
              key={option}
              className={option === selected ? "active" : ""}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}