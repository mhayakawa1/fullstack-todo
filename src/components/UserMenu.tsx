import { useState } from "react";
import NavLink from "./NavLink";

export default function UserMenu() {
  const [isVisible, setIsVisible] = useState(false);

  const closeMenu = (event: { relatedTarget: unknown }) => {
    if (!event.relatedTarget) {
      setIsVisible(false);
    }
  };

  return (
    <div tabIndex={0} onBlur={closeMenu} className="relative">
      <button
        onClick={() => setIsVisible((current) => !current)}
        className="border-solid w-8 h-8 rounded-full"
      ></button>
      {isVisible ? (
        <div className="absolute border-solid bg-white right-0 py-2">
          <ul className="m-0 p-0 list-none">
            <li className="py-1 ml-2 mr-6">Username</li>
            <li className="w-full h-fit">
              <span className="block w-full h-[1px] bg-black"></span>
            </li>
            <NavLink className="py-1 ml-2 mr-6" path="login" name="Logout" />
          </ul>
        </div>
      ) : null}
    </div>
  );
}
