import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

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
        className="flex justify-center items-center w-10 h-10 rounded-full border-none bg-white"
      >
        <FaUser className="w-5 h-5 text-[#3f27c2]" />
      </button>
      {isVisible ? (
        <div className="absolute bg-white rounded-lg right-0 mt-2">
          <ul className="m-0 p-0 list-none text-[#3f27c2]">
            <li className="flex justify-center items-center gap-2 px-4 py-6">
              <div className="w-10 h-10 flex justify-center items-center rounded-full border-solid aspect-square">
                <FaUser className="w-6 h-6" />
              </div>
              <ul className="p-0 list-none">
                <li>Username</li>
                <li className="text-sm">username@gmail.com</li>
              </ul>
            </li>
            <li className="w-full h-fit">
              <span className="block w-full h-[1px] bg-[#3f27c2]"></span>
            </li>
            <li className="h-fit w-full flex">
              <Link
                to="login"
                className="px-4 py-2 grow w-full h-full rounded-b-lg no-underline text-[#3f27c2] hover:bg-[#3f27c2] hover:text-white"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
