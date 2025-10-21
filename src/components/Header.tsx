import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(location.pathname === "/dashboard");
  }, [location]);

  return (
    <header className="w-full h-16 flex justify-between items-center box-border p-3 pl-6">
      <a href="#" className="no-underline">
        To Do List
      </a>
      {isLoggedIn ? <UserMenu /> : null}
    </header>
  );
}
