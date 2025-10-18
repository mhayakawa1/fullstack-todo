import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NavLink from "./components/NavLink";
import Error from "./components/Error";

function App() {
  return (
    <Router>
      <header className="flex justify-end p-4">
        <header className="w-full flex justify-between">
          <a>To Do List</a>
          <ul className="w-fit flex justify-between gap-2 list-none p-0">
            <NavLink path="login" name="Login" />
            <NavLink path="signup" name="Signup" />
          </ul>
        </header>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="*" Component={Error} />
      </Routes>
    </Router>
  );
}

export default App;
