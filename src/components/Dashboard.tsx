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
  const [input, setInput] = useState("");
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
    if (input.length) {
      const newTasks = [...tasks];
      const date = new Date();
      const taskData = {
        id: date.toISOString() + date.getMilliseconds(),
        userId: "",
        title: input,
        description: "",
        status: false,
        dueDate: date,
        createdAt: date,
        updatedAt: date,
      };
      newTasks.push(taskData);
      setTasks(newTasks);
      setSortedTasks(newTasks);
      setInput("");
      setSortValue("Date (Ascending)");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const updateTasks = (id: string, input: string | boolean | undefined) => {
    const newTasks = [...tasks];
    const newTask = tasks.find((task: TaskInterface) => task.id === id);
    if (newTask !== undefined) {
      if (typeof input === "boolean") {
        newTask.status = !input;
      } else if (typeof input === "string") {
        newTask.title = input;
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
        <form onSubmit={addTask}>
          <input onChange={handleChange} value={input} />
          <button onClick={addTask}>+</button>
        </form>
      </div>
      <div className="flex justify-center p-4">
        <SearchBar setSearchValue={setSearchValue} />
        <SortDropdown sortValue={sortValue} sortTasks={sortTasks} />
      </div>
      <ul className="flex flex-col items-center list-none">
        {sortedTasks
          .filter((task: TaskInterface) => task.title.includes(searchValue))
          .map((task: TaskInterface) => (
            <Task key={task.id} data={task} updateTasks={updateTasks} />
          ))}
      </ul>
    </main>
  );
}
