import { useState } from "react";
import "./App.css";
import Task from "./components/Task";
import SearchBar from "./components/SearchBar";
import SortDropdown from "./components/SortDropdown";

interface TaskInterface {
  id: string;
  date: object;
  text: string;
  complete: boolean;
}

type taskArray = TaskInterface[];

function App() {
  const [tasks, setTasks] = useState<taskArray>([]);
  const [sortedTasks, setSortedTasks] = useState<taskArray>([]);
  const [input, setInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("Date (Ascending)");

  const sortTasks = (value: string, list: taskArray | undefined) => {
    setSortValue(value);
    let newDisplayTasks = list ? [...list] : [...tasks];
    if (value === "Complete") {
      newDisplayTasks = [
        ...tasks.filter((task: TaskInterface) => task.complete),
      ];
    } else if (value === "Incomplete") {
      newDisplayTasks = [
        ...tasks.filter((task: TaskInterface) => !task.complete),
      ];
    } else if (value.includes("Date")) {
      newDisplayTasks = [...tasks.sort((a, b) => (a.date > b.date ? 1 : -1))];
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
        date: date,
        text: input,
        complete: false,
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
        newTask.complete = !input;
      } else if (typeof input === "string") {
        newTask.text = input;
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
    <div className="">
      <header className="flex justify-end p-4">
        <div className="flex justify-between gap-1">
          <button>Signup</button>
          <button>Login</button>
        </div>
      </header>
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
          .filter((task: TaskInterface) => task.text.includes(searchValue))
          .map((task: TaskInterface) => (
            <Task key={task.id} data={task} updateTasks={updateTasks} />
          ))}
      </ul>
    </div>
  );
}

export default App;
