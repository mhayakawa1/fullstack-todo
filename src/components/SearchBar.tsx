import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  searchTodos: (event: React.FormEvent<HTMLFormElement>, input: string) => void;
}

export default function SearchBar(props: SearchProps) {
  const { searchTodos } = props;
  const [input, setInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value.toLowerCase());
  };

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(input);
    }, 50);
  }, [input]);

  return (
    <form
      onSubmit={(event) => {
        searchTodos(event, input);
        setInput("");
      }}
      className="w-[400px] grow flex items-center gap-2 bg-white rounded-lg h-10 pl-4 box-border"
    >
      <FaSearch className="text-[#3f27c2]" />
      <input
        className="w-full bg-transparent border-none outline-none text-[#3f27c2]"
        onChange={handleChange}
        placeholder="Search"
        value={debouncedValue}
      />
    </form>
  );
}
