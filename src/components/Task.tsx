import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import TaskText from "./TaskText";
import TaskContainer from "./TaskContainer";

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

  const editText = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
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
    <TaskContainer>
      <li className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 grow">
            <TaskText
              id={id}
              isTitle={true}
              editText={editText}
              disabled={disabled}
              value={newTitle}
            />
            <TaskText
              id={id}
              isTitle={false}
              editText={editText}
              disabled={disabled}
              value={newDescription}
            />
          </div>
          <div className="inline-flex items-center">
            <label className="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                onChange={() => updateTasks(id, !status, undefined)}
                checked={status}
                className="peer w-6 h-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border bg-white"
                id="check"
              />
              <FaCheck className="absolute text-[#3f27c2] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />{" "}
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-1">
          <button
            onClick={toggleEdit}
            className="w-16 py-1 px-2 border-none rounded-md bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white"
          >
            {disabled ? "Edit" : "Save"}
          </button>
          <button
            onClick={() => updateTasks(id, undefined, undefined)}
            className="w-16 py-1 px-2 border-none rounded-md bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white"
          >
            Delete
          </button>
        </div>
      </li>
    </TaskContainer>
  );
}
