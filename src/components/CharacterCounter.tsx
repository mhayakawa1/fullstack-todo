interface CounterProps {
  limit: number;
  length: number;
}

export default function CharacterCounter(props: CounterProps) {
  const { limit, length } = props;
  return (
    <p
      className={`${
        length < limit ? "text-white" : "text-red-500"
      } w-fit mx-0 my-auto text-xs self-end`}
    >
      {length}/{limit}
    </p>
  );
}
