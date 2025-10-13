import { useState } from "react";
import "./App.css";
import Task from "./components/Task";

interface TaskInterface {
  id: string;
  date: object;
  text: string;
  complete: boolean;
}

type taskArray = TaskInterface[];

function App() {
  const [tasks, setTasks] = useState<taskArray>([]);
  const [listVisible, setListVisible] = useState(false);
  const [input, setInput] = useState("");

  const addTask = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (input.length) {
      const newTasks = [...tasks];
      const date = new Date();
      const taskData = {
        id: date.toISOString(),
        date: date,
        text: input,
        complete: false,
      };
      newTasks.push(taskData);
      setTasks(newTasks);
      setInput("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const updateTasks = (date: object, input: string | boolean | undefined) => {
    const newTasks = [...tasks];
    const newTask = tasks.find((task: TaskInterface) => task.date === date);
    if (newTask !== undefined) {
      if (typeof input === "boolean") {
        newTask.complete = !input;
      } else if (typeof input === "string") {
        newTask.text = input;
      } else {
        newTasks.splice(newTasks.indexOf(newTask), 1);
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
        <input className="" placeholder="Search" />
        <div className="relative">
          <button
            className=""
            onClick={() => setListVisible((current) => !current)}
          >
            <img src="null" alt="" />
            <span>Sort By</span>
          </button>
          {listVisible ? (
            <ul className="absolute bg-white list-none p-0">
              <li>Incomplete</li>
              <li>Complete</li>
              <li>Date (Ascending)</li>
              <li>Date (Descending)</li>
            </ul>
          ) : null}
        </div>
      </div>
      <ul className="flex flex-col items-center list-none">
        {tasks.map((task: TaskInterface) => (
          <Task key={task.date.toString()} data={task} updateTasks={updateTasks} />
        ))}
      </ul>
    </div>
  );
}

export default App;
