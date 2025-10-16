import { useState, useEffect } from "react";
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
  }, [input]);

  return (
    <input
      className=""
      onChange={handleChange}
      placeholder="Search"
      value={debouncedValue}
    />
  );
}
