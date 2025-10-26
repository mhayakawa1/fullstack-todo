import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  setSearchValue: (input: string) => void;
}

export default function SearchBar(props: SearchProps) {
  const { setSearchValue } = props;
  const [input, setInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(input);
      setSearchValue(input);
    }, 50);
  }, [input, setSearchValue]);

  return (
    <div className="w-[400px] grow flex items-center gap-2 bg-white rounded-lg h-10 pl-4 box-border">
      <FaSearch className="text-[#3f27c2]" />
      <input
        className="w-full bg-transparent border-none outline-none text-[#3f27c2]"
        onChange={handleChange}
        placeholder="Search"
        value={debouncedValue}
      />
    </div>
  );
}
