interface Options {
  name: string;
  params: {
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface OptionProps {
  index: number;
  value: Options;
  sortTodos: (value: Options) => void;
}

export default function SortOption(props: OptionProps) {
  const { index, value, sortTodos } = props;
  return (
    <li>
      <button
        className={`${index === 0 && "rounded-t-md"} ${
          index === 5 && "rounded-b-md"
        } grow w-full h-8 pl-4 pr-8 border-none text-left bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white`}
        onClick={() => sortTodos(value)}
      >
        <span>{value.name}</span>
      </button>
    </li>
  );
}
