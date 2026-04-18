import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserDataProvider } from "./contexts/userDataContext";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Error from "./components/Error";
const clientId = process.env.CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
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
