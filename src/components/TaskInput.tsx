interface InputProps {
  id: string;
  disabled: boolean;
  editText: () => void;
  value: string;
}

export default function TaskInput(props: InputProps) {
  const { id, disabled, editText, value } = props;
  return (
    <input
      id={`${id}-title`}
      disabled={disabled}
      onChange={editText}
      className="border-solid border-x-transparent border-t-transparent border-b-[1px] outline-none"
      value={value}
    />
  );
}
