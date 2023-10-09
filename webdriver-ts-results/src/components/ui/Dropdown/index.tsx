import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.css";

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  width: string;
}

const Dropdown = ({ label, children, width }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as HTMLElement)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`dropdown-button ${isOpen ? "has-shadow" : ""}`}
      >
        {label} <span className="caret"></span>
      </button>
      <div
        className={`dropdown-content ${isOpen ? "open" : ""}`}
        style={{ width: width }}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
