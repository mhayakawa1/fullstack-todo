interface OptionProps {
  index: number;
  value: string;
  sortTasks: (value: string, list: undefined) => void;
}

export default function SortOption(props: OptionProps) {
  const { index, value, sortTasks } = props;
  return (
    <li>
      <button
        className={`${index === 0 && "rounded-t-md"} ${
          index === 3 && "rounded-b-md"
        } grow w-full h-8 pl-4 pr-8 border-none text-left bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white`}
        onClick={() => sortTasks(value, undefined)}
      >
        <span>{value}</span>
      </button>
    </li>
  );
}
