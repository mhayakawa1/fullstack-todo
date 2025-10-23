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
  updateTasks: (
    id: string,
    newStatus: boolean | undefined,
    newText: { title: string; description: string } | undefined
  ) => void;
}

export default function Task(props: TaskProps) {
  const { data, updateTasks } = props;
  const { id, title, description, status } = data;
  const [disabled, setDisabled] = useState(true);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const editText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { id, value },
    } = event;
    if (id.includes("title")) {
      setNewTitle(value);
    } else {
      setNewDescription(value);
    }
  };

  const toggleEdit = () => {
    setDisabled((current) => !current);
    if (!disabled) {
      updateTasks(id, undefined, {
        title: newTitle,
        description: newDescription,
      });
    }
  };

  return (
    <li className="border-solid w-[400px] p-4">
      <div className="flex flex-col">
        <input
          id={`${id}-title`}
          disabled={disabled}
          onChange={editText}
          className="border-solid border-x-transparent border-t-transparent border-b-[1px] outline-none"
          value={newTitle}
        />
        <input
          id={`${id}-description`}
          disabled={disabled}
          onChange={editText}
          className="border-solid border-x-transparent border-t-transparent border-b-[1px] outline-none"
          value={newDescription}
        />
      </div>
      <button onClick={toggleEdit}>{disabled ? "Edit" : "Save"}</button>
      <button onClick={() => updateTasks(id, !status, undefined)}>
        {status ? "Complete" : "Incomplete"}
      </button>
      <button onClick={() => updateTasks(id, undefined, undefined)}>
        Delete
      </button>
    </li>
  );
}
