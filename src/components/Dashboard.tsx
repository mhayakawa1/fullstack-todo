import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Todo from "./Todo";
import TodoContainer from "./TodoContainer";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import CharacterCounter from "./CharacterCounter";

interface TodoInterface {
  id: string | number;
  userId: string;
  title: string;
  description: string;
  status: boolean;
  dueDate: string;
  createdAt: object;
  updatedAt: object;
}

type taskArray = TodoInterface[];

export default function Dashboard() {
  const today = new Date();
  const url = "http://localhost:8080/todos";
  const [todos, setTodos] = useState<taskArray>([]);
  const [sortedTodos, setSortedTodos] = useState<taskArray>([]);
  const [title, setTitle] = useState("New Task");
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("Description");
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("Date (Ascending)");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const updateArrays = (newTodos: taskArray) => {
    setTodos(newTodos);
    setSortedTodos(newTodos);
  };

  async function makeRequest(url: string, options: RequestInit) {
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (options.method === "GET") {
          updateArrays(data);
        }
        setErrorVisible(false);
      })
      .catch((error) => {
        setErrorText(JSON.stringify(error));
        setErrorVisible(true);
      });
  }

  useEffect(() => {
    if (!todos.length) {
      makeRequest(url, { method: "GET" });
    }
  }, [makeRequest, todos.length]);

  const sortTodos = (value: string, list: taskArray | undefined) => {
    setSortValue(value);
    let newDisplayTasks = list ? [...list] : [...todos];
    if (value === "Complete") {
      newDisplayTasks = [...todos.filter((task: TodoInterface) => task.status)];
    } else if (value === "Incomplete") {
      newDisplayTasks = [
        ...todos.filter((task: TodoInterface) => !task.status),
      ];
    } else if (value.includes("Created")) {
      newDisplayTasks = [
        ...todos.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)),
      ];
    } else if (value.includes("Due")) {
      newDisplayTasks = [
        ...todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1)),
      ];
    }
    if (value.includes("Descending")) {
      newDisplayTasks.reverse();
    }
    setSortedTodos(newDisplayTasks);
  };

  const addTodo = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (title.length) {
      const newTodos = [...todos];
      const date = new Date();
      const id = Math.max(...todos.map((element) => Number(element.id))) + 1;
      const todoData = {
        userId: "userId1",
        title: title,
        description: description,
        status: false,
        dueDate: dueDate.toISOString(),
        createdAt: date,
        updatedAt: date,
        id: id,
      };
      newTodos.push(todoData);
      updateArrays(newTodos);
      setTitle("New Task");
      setDueDate(today);
      setDescription("Description");
      setSortValue("Date (Ascending)");
      makeRequest(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });
    }
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      target: { id, value },
    } = event;
    event.preventDefault();
    if (id === "title") {
      setTitle(value);
    } else if (id === "due-date") {
      setDueDate(new Date(value));
    } else {
      setDescription(value);
    }
  };

  const updateTodos = (
    id: string | number,
    newStatus: boolean | undefined,
    newText: { title: string; description: string } | undefined
  ) => {
    const newTodos = [...todos];
    const newTodo = todos.find((todo: TodoInterface) => todo.id === id);
    if (newTodo !== undefined) {
      if (!newText && newStatus === undefined) {
        newTodos.splice(newTodos.indexOf(newTodo), 1);
        const newDisplayTasks = [...sortedTodos];
        newDisplayTasks.splice(newDisplayTasks.indexOf(newTodo), 1);
        setSortedTodos(newDisplayTasks);
        makeRequest(`${url}/${newTodo.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        if (newStatus !== undefined) {
          newTodo.status = newStatus;
        } else if (newText) {
          const { title, description } = newText;
          if (title !== newTodo.title) {
            newTodo.title = title;
          }
          if (description !== newTodo.description) {
            newTodo.description = description;
          }
        }
        makeRequest(`${url}/${newTodo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
      }
      setTodos(newTodos);
    }
  };

  return (
    <main className="flex flex-col items-center gap-6 pb-[64vh]">
      <div className="flex flex-col items-center px-4 gap-4 box-border">
        <h1 className="text-white font-medium">TO DO LIST</h1>
        {errorVisible ? (
          <div className="flex flex-col justify-center items-center gap-4 w-[400px] h-fit box-border rounded-lg p-0 bg-white bg-opacity-25">
            <p className="text-red-500">{errorText}</p>
          </div>
        ) : null}
        <form onSubmit={addTodo} className="flex flex-col items-center gap-4">
          <TodoContainer>
            <div className="w-full flex flex-col items-center gap-1 m-0">
              <div className="w-full m-0 flex gap-2">
                <input
                  id="title"
                  type="text"
                  onChange={handleChange}
                  value={title}
                  autoFocus
                  minLength={1}
                  maxLength={120}
                  className="grow h-4 p-0 outline-none border-none text-white bg-transparent text-lg m-0"
                />
                <CharacterCounter limit={120} length={title.length} />
              </div>
              <div className="self-start flex items-center gap-1">
                <label htmlFor="due-date" className="text-sm text-white">
                  Due Date:
                </label>
                <input
                  id="due-date"
                  type="date"
                  value={dueDate.toLocaleDateString("en-ca")}
                  onChange={handleChange}
                  min={today.toLocaleDateString("en-ca")}
                  className="bg-transparent border-none outline-none text-white w-[112px]"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <textarea
                  id="description"
                  onChange={handleChange}
                  value={description}
                  maxLength={2000}
                  className="w-full m-0 h-24 outline-none border-none text-white bg-white bg-opacity-25 resize-none rounded-lg p-2 box-border"
                />
                <CharacterCounter limit={2000} length={description.length} />
              </div>
            </div>
          </TodoContainer>
          <button
            onClick={addTodo}
            className="flex justify-center items-center m-auto p-0 w-8 h-8 text-base text-[#3f27c2] bg-white border-none rounded-sm"
          >
            <FaPlus />
          </button>
        </form>
      </div>
      <SearchBar setSearchValue={setSearchValue} />
      <div className="flex flex-col items-center justify-center gap-2 w-[400px] ">
        <SortDropdown sortValue={sortValue} sortTodos={sortTodos} />
        <ul className="flex flex-col items-center gap-2 list-none p-0 m-0">
          {sortedTodos
            .filter((task: TodoInterface) =>
              `${task.title} ${task.description}`
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            )
            .map((task: TodoInterface) => (
              <Todo key={task.id} data={task} updateTodos={updateTodos} />
            ))}
        </ul>
      </div>
    </main>
  );
}
