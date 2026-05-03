interface DateInputProps {
  value: string;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  min: string;
  disabled: boolean;
}

export default function DateInput(props: DateInputProps) {
  const { value, handleChange, min, disabled } = props;
  return (
    <div className="self-start flex items-center gap-1">
      <label htmlFor="due-date" className="text-sm text-white">
        Due Date:
      </label>
      <input
        id="due-date"
        type="date"
        value={value}
        onChange={handleChange}
        min={min}
        disabled={disabled}
        className="bg-transparent border-none outline-none text-white w-[112px]"
      />
    </div>
  );
}
