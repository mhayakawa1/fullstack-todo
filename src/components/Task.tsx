import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import TaskText from "./TaskText";
import TaskContainer from "./TaskContainer";
import CharacterCounter from "./CharacterCounter";

interface TaskProps {
  data: {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: string;
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
  const { id, title, dueDate, description, status } = data;
  const today = new Date().toLocaleDateString("en-ca");
  const [disabled, setDisabled] = useState(true);
  const [newTitle, setNewTitle] = useState(title);
  const [newDueDate, setNewDueDate] = useState(new Date(dueDate));
  const [newDescription, setNewDescription] = useState(description);

  const editText = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      target: { id, value },
    } = event;
    if (id.includes("title")) {
      setNewTitle(value);
    } else if (id === "due-date") {
      setNewDueDate(new Date(value.replaceAll("-", "/")));
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
      <li className="w-full flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0 grow">
            <div className="w-full flex justify-between">
              <div className="grow w-full flex justify-between items-center">
                <TaskText
                  id={id}
                  isTitle={true}
                  editText={editText}
                  disabled={disabled}
                  value={newTitle}
                />
                {disabled ? null : (
                  <CharacterCounter limit={120} length={newTitle.length} />
                )}
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
            <div className="self-start flex items-center gap-1 mb-1">
              <label htmlFor="due-date" className="text-sm text-white">
                Due Date:
              </label>
              <input
                id="due-date"
                type="date"
                value={newDueDate.toLocaleDateString("en-ca")}
                onChange={editText}
                disabled={disabled}
                min={today}
                className="bg-transparent border-none outline-none text-white w-[112px]"
              />
            </div>
            <div>
              <TaskText
                id={id}
                isTitle={false}
                editText={editText}
                disabled={disabled}
                value={newDescription}
              />
              <div className="h-4 flex justify-end">
                {disabled ? null : (
                  <CharacterCounter
                    limit={2000}
                    length={newDescription.length}
                  />
                )}
              </div>
            </div>
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
