import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaX } from "react-icons/fa6";
import Todo from "./Todo";
import TodoContainer from "./TodoContainer";
import ListButtons from "./ListButtons";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import CharacterCounter from "./CharacterCounter";
import DeletePopup from "./DeletePopup";
import { url } from "../config";

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
  const defaultSortValue = useMemo(
    () => ({
      name: "Date Created (Desc)",
      params: {
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
      },
    }),
    [],
  );
  const [initialRender, setInitialRender] = useState(true);
  const [todos, setTodos] = useState<TodosArray>([]);
  const [sortedTodos, setSortedTodos] = useState<TodosArray>([]);
  const [title, setTitle] = useState("New Task");
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("Description");
  const [sortOptions, setSortOptions] = useState<Options>(defaultSortValue);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorId, setErrorId] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(1);
  const [term, setTerm] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const todosRef = useRef<TodosArray>([]);
  const navigate = useNavigate();

  const updateArrays = (newTodos: TodosArray) => {
    setTodos(newTodos);
    setSortedTodos(newTodos);
    todosRef.current = newTodos;
  };

  const makeRequest = useCallback(
    async (url: string, request: RequestInit, options: Options | null) => {
      const { method } = request;
      const newTodos = [...todosRef.current];
      if (options && options.params) {
        Object.entries(options.params).forEach((entry, index) => {
          return (url =
            url + `${index !== 0 ? "&" : ""}${entry[0]}=${entry[1]}`);
        });
      }
      const response = await fetch(url, request);
      if (url.includes("search")) {
        const start = "?search=";
        const end = "&sortBy=";
        const startIndex = url.indexOf(start);
        const endIndex = url.indexOf(end, startIndex + start.length);
        setTerm(url.substring(startIndex + start.length, endIndex));
      }
      if (!response.ok) {
        if (method === "DELETE" || method === "PATCH") {
          setErrorId(url.slice(33));
        }
        const error = await response.text();
        setErrorText(error.length < 50 ? error : response.statusText);
        if (response.status === 401) {
          //eslint-disable-next-line
          console.clear();
          navigate("/login");
        }
        setErrorVisible(true);
        if (method !== "DELETE") {
          return error;
        }
      } else {
        setErrorId("");
        setErrorText("");
        setErrorVisible(false);
        if (method === "DELETE") {
          return response.text();
        }
      }

      const data = await response.json();
      if (data) {
        const { items, total, todo } = data;
        const index = newTodos.findIndex((todo) => todo.id === data.id);
        if (method === "PATCH") {
          newTodos.splice(index, 1, data);
          updateArrays(newTodos);
          setTitle("New Task");
          setDescription("Description");
        } else if (items) {
          setPage(data.page);
          if (total) {
            setTotal(Math.ceil(data.total / data.limit));
          }
          updateArrays(items);
        } else if (todo) {
          updateArrays([todo, ...todosRef.current]);
        }
        setErrorVisible(false);
      }
      return data;
    },
    [navigate],
  );

  useEffect(() => {
    if (initialRender) {
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
      setInitialRender(false);
    }
  }, [makeRequest, todos.length, navigate, defaultSortValue, initialRender]);

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
        status: "in_progress",
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
    newData:
      | { title: string; description: string; dueDate: string }
      | undefined,
  ) => {
    const newTodos = [...todos];
    const newTodo = todos.find((todo: TodoInterface) => todo.id === id);
    if (newTodo !== undefined) {
      if (!newData && newStatus === undefined) {
        return makeRequest(
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
            updateArrays(newDisplayTasks);
            return newDisplayTasks;
          })
          .catch(() => {
            setErrorText("Delete unsuccessful");
          });
      } else {
        if (newStatus !== undefined) {
          newTodo.status = newStatus ? "done" : "in_progress";
        } else if (newData) {
          const newEntries = Object.entries(newData);
          for (let i = 0; i < newEntries.length; i++) {
            (newTodo as unknown as Record<string, unknown>)[newEntries[i][0]] =
              newEntries[i][1];
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
    setSortOptions(newSortOptions);
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
  };

  const togglePopup = (
    id: string | number,
    popupTitle: string,
    deleteItem: boolean,
  ) => {
    setPopupTitle(popupTitle);
    setPopupVisible((current: boolean) => !current);
    setDeleteId(id.toString());
    if (deleteId && deleteItem) {
      updateTodos(deleteId, undefined, undefined);
    }
  };

  return (
    <main className="relative">
      {popupVisible ? (
        <DeletePopup popupTitle={popupTitle} togglePopup={togglePopup} />
      ) : null}
      <div className="relative flex flex-col items-center gap-6 p-0 max-w-[400px] max-sm:w-[90vw] mx-auto">
        <div className="w-full flex flex-col items-center gap-4 box-border">
          <h1 className="text-white font-medium">TO DO LIST</h1>
          {errorVisible ? (
            <div className="flex flex-col justify-center items-center gap-4 w-full h-fit box-border rounded-lg px-4 bg-white bg-opacity-25">
              <p className="text-red-500">{errorText}</p>
            </div>
          ) : null}
          <form
            onSubmit={addTodo}
            className="w-full flex flex-col items-center gap-4"
          >
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
              className="flex justify-center items-center m-auto p-0 w-8 h-8 text-base text-[#1a45bd] bg-white border-none rounded-sm"
            >
              <FaPlus />
            </button>
          </form>
        </div>
        <SearchBar searchTodos={searchTodos} />
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-2 pb-[20vh]">
          <SortDropdown sortOptions={sortOptions} sortTodos={sortTodos} />
          {term.length ? (
            <div className="flex justify-center items-center gap-2 pt-[2vh] w-full">
              <p className="m-0 text-center text-white text-sm">
                <span>{`"${term}"`}</span>
                <span>{` - ${todos.length} Results`}</span>
              </p>
              <button
                className="bg-transparent border-solid border-white border-[1.5px] text-white flex justify-center items-center aspect-square rounded-sm w-4 p-0"
                onClick={() => {
                  setTerm("");
                  makeRequest(
                    `${url}todos?`,
                    { method: "GET", credentials: "include" },
                    sortOptions,
                  );
                }}
              >
                <FaX className="w-2" />
              </button>
            </div>
          ) : null}
          <ul className="w-full flex flex-col items-center gap-2 list-none p-0 m-0]">
            {todos.length
              ? todos.map((todo: TodoInterface) => (
                  <Todo
                    key={todo.id}
                    data={todo}
                    errorId={errorId}
                    updateTodos={updateTodos}
                    togglePopup={togglePopup}
                  />
                ))
              : null}
          </ul>
          {sortedTodos.length ? (
            <ListButtons page={page} total={total} updatePage={updatePage} />
          ) : (
            <p className="text-white text-sm justify-self-end m-0">
              Empty list.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
