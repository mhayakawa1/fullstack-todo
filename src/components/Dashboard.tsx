import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Todo from "./Todo";
import TodoContainer from "./TodoContainer";
import ListButtons from "./ListButtons";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import CharacterCounter from "./CharacterCounter";

interface TodoInterface {
  id: string | number;
  userId: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: object;
  updatedAt: object;
}

type TodosArray = TodoInterface[];

interface Options {
  name: string;
  params: {
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  };
}

export default function Dashboard() {
  const today = new Date();
  const url = "https://localhost:8080/api/";
  const defaultSortValue = {
    name: "Date Created (Asc)",
    params: {
      sortBy: "created",
      sortOrder: "asc",
      page: 1,
    },
  };
  const [todos, setTodos] = useState<TodosArray>([]);
  const [sortedTodos, setSortedTodos] = useState<TodosArray>([]);
  const [title, setTitle] = useState("New Task");
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("Description");
  const [sortOptions, setSortOptions] = useState<Options>(defaultSortValue);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const todosRef = useRef<TodosArray>([]);
  const navigate = useNavigate();

  const updateArrays = (newTodos: TodosArray) => {
    setTodos(newTodos);
    setSortedTodos(newTodos);
    todosRef.current = newTodos;
  };

  const makeRequest = useCallback(
    async (url: string, request: RequestInit, options: Options | null) => {
      if (options && options.params) {
        Object.entries(options.params).forEach((entry, index) => {
          return (url =
            url + `${index !== 0 ? "&" : ""}${entry[0]}=${entry[1]}`);
        });
      }
      fetch(url, request)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const { items, total } = data;
          if (request.method === "PATCH") {
            const newTodos = [...todosRef.current];
            const index = newTodos.findIndex((todo) => todo.id === data.id);
            newTodos.splice(index, 1, data);
            updateArrays(newTodos);
            setTitle("New Task");
            setDescription("Description");
          } else if (items) {
            setPage(data.page);
            if (total) {
              setTotal(Math.ceil(data.total / 2));
            }
            updateArrays(items);
          }
          setErrorVisible(false);
        })
        .catch((error) => {
          if (error.message) {
            setErrorText(error.message);
            if (error.message.includes("403")) {
              //eslint-disable-next-line
              console.clear();
              navigate("/login");
            }
          }
          setErrorVisible(true);
        });
    },
    [navigate],
  );

  useEffect(() => {
    if (!todos.length) {
      makeRequest(
        `${url}todos?`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
        defaultSortValue,
      );
    }
  }, [makeRequest, todos.length, navigate, defaultSortValue]);

  const sortTodos = (options: Options) => {
    options.params.page = 1;
    setSortOptions(options);
    const sortedUrl = `${url}todos?`;
    makeRequest(sortedUrl, { method: "GET", credentials: "include" }, options);
  };

  const addTodo = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (title.length) {
      const date = new Date();
      const id = crypto.randomUUID();
      const todoData = {
        title: title,
        description: description,
        status: "incomplete",
        dueDate: dueDate.toISOString(),
        createdAt: date,
        updatedAt: date,
        id: id,
      };
      setTitle("New Task");
      setDueDate(today);
      setDescription("Description");
      setSortOptions(defaultSortValue);
      makeRequest(
        `${url}todos`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(todoData),
          headers: {
            "Content-Type": "application/json",
          },
        },
        null,
      );
    }
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
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
    newText: { title: string; description: string } | undefined,
  ) => {
    const newTodos = [...todos];
    const newTodo = todos.find((todo: TodoInterface) => todo.id === id);
    if (newTodo !== undefined) {
      if (!newText && newStatus === undefined) {
        makeRequest(
          `${url}todos/${newTodo.id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
          null,
        )
          .then(() => {
            newTodos.splice(newTodos.indexOf(newTodo), 1);
            const newDisplayTasks = [...sortedTodos];
            newDisplayTasks.splice(newDisplayTasks.indexOf(newTodo), 1);
            setSortedTodos(newDisplayTasks);
          })
          .catch(() => {
            setErrorText("Delete unsuccessful");
          });
      } else {
        if (newStatus !== undefined) {
          newTodo.status = newStatus ? "complete" : "incomplete";
        } else if (newText) {
          const { title, description } = newText;
          if (title !== newTodo.title) {
            newTodo.title = title;
          }
          if (description !== newTodo.description) {
            newTodo.description = description;
          }
        }
        const date = new Date();
        newTodo.updatedAt = date;
        makeRequest(
          `${url}todos/${newTodo.id}`,
          {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(newTodo),
            headers: {
              "Content-Type": "application/json",
            },
          },
          null,
        );
      }
    }
  };

  const updatePage = (isLeft: boolean) => {
    const sortedUrl = `${url}todos?`;
    let newPage = page;
    if (isLeft && page !== 1) {
      newPage -= 1;
      setPage(newPage);
    } else if (!isLeft && page < total) {
      newPage += 1;
      setPage(newPage);
    }
    const newSortOptions = { ...sortOptions };
    newSortOptions.params.page = newPage;
    setSortOptions(sortOptions);
    makeRequest(
      sortedUrl,
      { method: "GET", credentials: "include" },
      newSortOptions,
    );
  };

  const searchTodos = (
    event: React.FormEvent<HTMLFormElement>,
    input: string,
  ) => {
    event.preventDefault();
    const sortedUrl = `${url}todos?search=${input}&`;

    makeRequest(
      sortedUrl,
      { method: "GET", credentials: "include" },
      sortOptions,
    );
    // setSearchValue(input);
  };

  return (
    <main className="flex flex-col items-center gap-6 pb-[64vh]">
      <div className="flex flex-col items-center px-4 gap-4 box-border">
        <h1 className="text-white font-medium">TO DO LIST</h1>
        {errorVisible ? (
          <div className="flex flex-col justify-center items-center gap-4 w-[400px] h-fit box-border rounded-lg px-4 bg-white bg-opacity-25">
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
      <SearchBar searchTodos={searchTodos} />
      <div className="flex flex-col items-center justify-center gap-2 w-[400px] ">
        <SortDropdown sortOptions={sortOptions} sortTodos={sortTodos} />
        <ul className="flex flex-col items-center gap-2 list-none p-0 m-0">
          {todos.length
            ? todos.map((todo: TodoInterface) => (
                <Todo key={todo.id} data={todo} updateTodos={updateTodos} />
              ))
            : null}
        </ul>
        {sortedTodos.length ? (
          <ListButtons page={page} total={total} updatePage={updatePage} />
        ) : null}
      </div>
    </main>
  );
}
