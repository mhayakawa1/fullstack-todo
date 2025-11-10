import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Error from "./components/Error";

function App() {
  return (
    <GoogleOAuthProvider clientId="337374147821-5pqh07hmagj58a6cfinpp971gfj49512.apps.googleusercontent.com">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="*" Component={Error} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
