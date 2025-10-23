import { useState } from "react";
import Task from "./Task";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";

interface TaskInterface {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: boolean;
  dueDate: object;
  createdAt: object;
  updatedAt: object;
}

type taskArray = TaskInterface[];

export default function Dashboard() {
  const [tasks, setTasks] = useState<taskArray>([]);
  const [sortedTasks, setSortedTasks] = useState<taskArray>([]);
  const [title, setTitle] = useState("New Task");
  const [description, setDescription] = useState("Description");
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("Date (Ascending)");

  const sortTasks = (value: string, list: taskArray | undefined) => {
    setSortValue(value);
    let newDisplayTasks = list ? [...list] : [...tasks];
    if (value === "Complete") {
      newDisplayTasks = [...tasks.filter((task: TaskInterface) => task.status)];
    } else if (value === "Incomplete") {
      newDisplayTasks = [
        ...tasks.filter((task: TaskInterface) => !task.status),
      ];
    } else if (value.includes("Date")) {
      newDisplayTasks = [
        ...tasks.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)),
      ];
      if (value.includes("Descending")) {
        newDisplayTasks.reverse();
      }
    }
    setSortedTasks(newDisplayTasks);
  };

  const addTask = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (title.length) {
      const newTasks = [...tasks];
      const date = new Date();
      const taskData = {
        id: date.toISOString() + date.getMilliseconds(),
        userId: "",
        title: title,
        description: description,
        status: false,
        dueDate: date,
        createdAt: date,
        updatedAt: date,
      };
      newTasks.push(taskData);
      setTasks(newTasks);
      setSortedTasks(newTasks);
      setTitle("New Task");
      setDescription("Description");
      setSortValue("Date (Ascending)");
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
    } else {
      setDescription(value);
    }
  };

  const updateTasks = (
    id: string,
    newStatus: boolean | undefined,
    newText: { title: string; description: string } | undefined
  ) => {
    const newTasks = [...tasks];
    const newTask = tasks.find((task: TaskInterface) => task.id === id);
    if (newTask !== undefined) {
      if (newStatus !== undefined) {
        newTask.status = newStatus;
      } else if (newText) {
        const { title, description } = newText;
        if (title !== newTask.title) {
          newTask.title = title;
        }
        if (description !== newTask.description) {
          newTask.description = description;
        }
      } else {
        newTasks.splice(newTasks.indexOf(newTask), 1);
        const newDisplayTasks = [...sortedTasks];
        newDisplayTasks.splice(newDisplayTasks.indexOf(newTask), 1);
        setSortedTasks(newDisplayTasks);
      }
      setTasks(newTasks);
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center p-4">
        <h1>TO DO LIST</h1>
        <form onSubmit={addTask} className="flex flex-col items-center gap-2">
          <div className="border-solid flex flex-col gap-1 w-[400px] p-4">
            <input
              id="title"
              onChange={handleChange}
              value={title}
              className="outline-none border-none text-base font-semibold"
            />
            <textarea
              id="description"
              onChange={handleChange}
              value={description}
              className="outline-none border-none h-20 resize-none"
            />
          </div>
          <button onClick={addTask} className="m-auto">
            +
          </button>
        </form>
      </div>
      <div className="flex justify-center p-4">
        <SearchBar setSearchValue={setSearchValue} />
        <SortDropdown sortValue={sortValue} sortTasks={sortTasks} />
      </div>
      <ul className="flex flex-col items-center list-none p-0">
        {sortedTasks
          .filter((task: TaskInterface) =>
            `${task.title} ${task.description}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((task: TaskInterface) => (
            <Task key={task.id} data={task} updateTasks={updateTasks} />
          ))}
      </ul>
    </main>
  );
}
