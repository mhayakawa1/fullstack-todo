interface InputProps {
  id: string;
  isTitle: boolean;
  disabled: boolean;
  editText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function TaskInput(props: InputProps) {
  const { id, isTitle, disabled, editText, value } = props;
  return (
    <input
      id={`${id}-${isTitle ? "title" : "description"}`}
      disabled={disabled}
      onChange={editText}
      className={`${
        isTitle && "text-base"
      } text-black border-none outline-none`}
      value={value}
    />
  );
}
