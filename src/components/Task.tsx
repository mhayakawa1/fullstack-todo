import { useState } from "react";

interface TaskProps {
  data: {
    id: string;
    date: object;
    text: string;
    complete: boolean;
  };
  updateTasks: (id: string, newText: string | boolean | undefined) => void;
}

export default function Task(props: TaskProps) {
  const { data, updateTasks } = props;
  const { id, text, complete } = data;
  const [disabled, setDisabled] = useState(true);
  const [newText, setNewText] = useState(text);

  const editText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(event.target.value);
  };

  const toggleEdit = () => {
    setDisabled((current) => !current);
    if (!disabled) {
      updateTasks(id, newText);
    }
  };

  return (
    <li>
      <input
        disabled={disabled}
        onChange={editText}
        className="border-solid border-x-transparent border-t-transparent border-b-[1px] outline-none"
        value={newText}
      />
      <button onClick={toggleEdit}>{disabled ? "Edit" : "Save"}</button>
      <button onClick={() => updateTasks(id, complete)}>
        {complete ? "Complete" : "Incomplete"}
      </button>
      <button onClick={() => updateTasks(id, undefined)}>Delete</button>
    </li>
  );
}
