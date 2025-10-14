import { useState } from "react";
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
    <div className="relative" onBlur={closeSortOptions}>
      <button
        className=""
        onClick={() => setListVisible((current) => !current)}
      >
        <img src="null" alt="" />
        <span>Sort By</span>
      </button>
      {listVisible ? (
        <ul className="absolute bg-white list-none border-solid p-0">
          {options.map((option: string) => (
            <SortOption
              key={option}
              value={option}
              sortValue={sortValue}
              sortTasks={sortTasks}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
