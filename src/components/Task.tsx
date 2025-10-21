import { useState } from "react";

interface TaskProps {
  data: {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: object;
    createdAt: object;
    updatedAt: object;
  };
  updateTasks: (id: string, newText: string | boolean | undefined) => void;
}

export default function Task(props: TaskProps) {
  const { data, updateTasks } = props;
  const { id, title, status } = data;
  const [disabled, setDisabled] = useState(true);
  const [newText, setNewText] = useState(title);

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
      <button onClick={() => updateTasks(id, status)}>
        {status ? "Complete" : "Incomplete"}
      </button>
      <button onClick={() => updateTasks(id, undefined)}>Delete</button>
    </li>
  );
}
