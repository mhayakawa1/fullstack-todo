interface InputProps {
  id: string | number;
  isTitle: boolean;
  disabled: boolean;
  editText: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  value: string;
}

export default function TodoText(props: InputProps) {
  const { id, isTitle, disabled, editText, value } = props;
  const attributes = {
    id: `${id}-${isTitle ? "title" : "description"}`,
    disabled: disabled,
    onChange: editText,
    className: `${
      isTitle
        ? "w-[95%] text-lg"
        : "w-full h-24 resize-none bg-white bg-opacity-25 rounded-lg p-2 box-border"
    } text-white bg-transparent outline-none border-none`,
    value: value,
  };

  if (isTitle) {
    return <input {...attributes} />;
  } else {
    return <textarea {...attributes} />;
  }
}
