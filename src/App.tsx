import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="">
        <div>
          <button>Signup</button>
          <button>Login</button>
        </div>
      </header>
      <div>
        <h1>TO DO LIST</h1>
        <form>
          <input />
          <button>+</button>
        </form>
      </div>
      <div>
        <input placeholder="Search" />
        <div className="">
          <button className="">
            <img src="null" alt="" />
            <span>Sort By</span>
          </button>
          <ul className="">
            <li>Incomplete</li>
            <li>Complete</li>
            <li>Date (Ascending)</li>
            <li>Date (Descending)</li>
          </ul>
        </div>
      </div>
      <ul>
        <li>
          <input />
          <button>Status</button>
          <button>Delete</button>
        </li>
      </ul>
    </div>
  );
}

export default App;
