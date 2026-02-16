import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import SortOption from "./SortOption";

interface Options {
  name: string;
  params: {
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  };
}

interface DropdownProps {
  sortOptions: Options;
  sortTodos: (value: Options) => void;
}

const options = [
  {
    name: "Date Created (Asc)",
    params: { sortBy: "createdAt", sortOrder: "asc" },
  },
  {
    name: "Date Created (Desc)",
    params: { sortBy: "createdAt", sortOrder: "desc" },
  },
  { name: "Due Date (Asc)", params: { sortBy: "dueDate", sortOrder: "asc" } },
  { name: "Due Date (Desc)", params: { sortBy: "dueDate", sortOrder: "desc" } },
  { name: "Incomplete", params: { status: "incomplete" } },
  { name: "Complete", params: { status: "complete" } },
];

export default function SortDropdown(props: DropdownProps) {
  const { sortOptions, sortTodos } = props;
  const [listVisible, setListVisible] = useState(false);

  const closeSortOptions = () => {
    setTimeout(() => {
      setListVisible(false);
    }, 1000);
  };

  return (
    <div className="m-0 self-end" onBlur={closeSortOptions}>
      <button
        className="flex items-center gap-2 border-none bg-transparent text-white"
        onClick={() => setListVisible((current) => !current)}
      >
        <span>Sort By: {sortOptions.name}</span>
        <FaChevronDown className="text-white" />
      </button>
      {listVisible ? (
        <ul className="absolute bg-white list-none p-0 z-10 rounded-md">
          {options.map((option: Options, index: number) => (
            <SortOption
              key={option.name}
              index={index}
              value={option}
              sortTodos={sortTodos}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
