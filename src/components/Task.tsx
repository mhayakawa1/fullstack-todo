import { useState } from "react";
import TaskInput from "./TaskInput";

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
    newText: { title: string; description: string } | undefined,
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
      <div className="flex justify-between gap-1">
        <div className="flex flex-col grow">
          <TaskInput
            id={id}
            isTitle={true}
            editText={editText}
            disabled={disabled}
            value={newTitle}
          />
          <TaskInput
            id={id}
            isTitle={false}
            editText={editText}
            disabled={disabled}
            value={newDescription}
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            onChange={() => updateTasks(id, !status, undefined)}
            type="checkbox"
            checked={status}
            className="w-6 h-6 rounded-sm"
          />
        </div>
      </div>
      <button onClick={toggleEdit}>{disabled ? "Edit" : "Save"}</button>
      <button onClick={() => updateTasks(id, undefined, undefined)}>
        Delete
      </button>
    </li>
  );
}
