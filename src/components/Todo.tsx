import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import TodoText from "./TodoText";
import TodoContainer from "./TodoContainer";
import CharacterCounter from "./CharacterCounter";
import DateInput from "./DateInput";

interface TodoProps {
  data: {
    id: string | number;
    userId: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    createdAt: object;
    updatedAt: object;
  };
  errorId: string;
  updateTodos: (
    id: string | number,
    newChecked: boolean | undefined,
    newData:
      | { title: string; description: string; dueDate: string }
      | undefined,
    newPage: number,
  ) => void;
  togglePopup: (
    id: string | number,
    popupTitle: string,
    deleteItem: boolean,
  ) => void;
}

export default function Todo(props: TodoProps) {
  const { data, errorId, updateTodos, togglePopup } = props;
  const { id, title, dueDate, description, status } = data;
  const today = new Date().toLocaleDateString("en-ca");
  const [disabled, setDisabled] = useState(true);
  const [newTitle, setNewTitle] = useState(title);
  const [newDueDate, setNewDueDate] = useState(new Date(dueDate));
  const [newDescription, setNewDescription] = useState(description);
  const [checked, setChecked] = useState(status === "done");

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
    } else if (id === "due-date") {
      setNewDueDate(new Date(value.replaceAll("-", "/")));
    } else {
      setNewDescription(value);
    }
  };

  const toggleEdit = () => {
    setDisabled((current) => !current);
    if (!disabled) {
      updateTodos(
        id,
        undefined,
        {
          title: newTitle,
          description: newDescription,
          dueDate: newDueDate.toISOString(),
        },
        1,
      );
    }
  };

  return (
    <TodoContainer errorId={errorId} id={id.toString()}>
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 grow">
            <div className="w-full flex justify-between">
              <div className="grow w-full flex justify-between items-center">
                <TodoText
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
                    onChange={() => {
                      updateTodos(id, !checked, undefined, 1);
                      setChecked((current: boolean) => !current);
                    }}
                    checked={checked}
                    className="peer w-6 h-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border bg-white"
                    id="check"
                  />
                  <FaCheck className="absolute text-[#1a45bd] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />{" "}
                </label>
              </div>
            </div>
            <DateInput value={newDueDate.toLocaleDateString("en-ca")} handleChange={editText} disabled={disabled} min={today} />
            <div>
              <TodoText
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
            className="w-16 py-1 px-2 border-none rounded-md bg-white hover:bg-[#1a45bd] text-[#1a45bd] hover:text-white"
          >
            {disabled ? "Edit" : "Save"}
          </button>
          <button
            onClick={() => togglePopup(id, title, true)}
            className="w-16 py-1 px-2 border-none rounded-md bg-white hover:bg-[#1a45bd] text-[#1a45bd] hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </TodoContainer>
  );
}
