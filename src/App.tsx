import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserDataProvider } from "./contexts/userDataContext.js";
import "./App.css";
import Header from "./components/Header.js";
import Dashboard from "./components/Dashboard.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Error from "./components/Error.js";

function App() {
  return (
    <GoogleOAuthProvider clientId="337374147821-5pqh07hmagj58a6cfinpp971gfj49512.apps.googleusercontent.com">
      <UserDataProvider>
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
      </UserDataProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
