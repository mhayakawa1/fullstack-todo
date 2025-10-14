interface OptionProps {
  value: string;
  sortValue: string;
  sortTasks: (value: string, list: undefined) => void;
}

export default function SortOption(props: OptionProps) {
  const { value, sortValue, sortTasks } = props;
  return (
    <li>
      <button
        className={`w-full ${sortValue === value && "bg-gray-500"}`}
        onClick={() => sortTasks(value, undefined)}
      >
        {value}
      </button>
    </li>
  );
}
