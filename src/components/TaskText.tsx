interface InputProps {
  id: string;
  isTitle: boolean;
  disabled: boolean;
  editText: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  value: string;
}

export default function TaskText(props: InputProps) {
  const { id, isTitle, disabled, editText, value } = props;
  const attributes = {
    id: `${id}-${isTitle ? "title" : "description"}`,
    disabled: disabled,
    onChange: editText,
    className: `${
      isTitle ? "text-lg" : "resize-none"
    } text-white bg-transparent border-none outline-none`,
    value: value,
  };

  if (isTitle) {
    return <input {...attributes} />;
  } else {
    return <textarea {...attributes} />;
  }
}
