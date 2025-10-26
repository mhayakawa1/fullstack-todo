import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import SortOption from "./SortOption";

interface DropdownProps {
  sortValue: string;
  sortTasks: (value: string, list: undefined) => void;
}

const options = [
  "Date (Ascending)",
  "Date (Descending)",
  "Incomplete",
  "Complete",
];

export default function SortDropdown(props: DropdownProps) {
  const { sortValue, sortTasks } = props;
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
        <span>Sort By: {sortValue}</span>
        <FaChevronDown className="text-white" />
      </button>
      {listVisible ? (
        <ul className="absolute bg-white list-none p-0 z-10 rounded-md">
          {options.map((option: string, index: number) => (
            <SortOption
              key={option}
              index={index}
              value={option}
              sortTasks={sortTasks}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
