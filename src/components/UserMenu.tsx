import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import { FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function UserIcon(props: { picture: string; className: string }) {
  const { picture, className } = props;
  return (
    <div className={`${className} p-0 flex justify-center items-center`}>
      {picture.length ? (
        <img
          className={`${className} rounded-full object-contain m-0`}
          src={picture}
          alt=""
        />
      ) : (
        <div
          className={`${className} flex justify-center items-center rounded-full border-solid border-[#3f27c2] aspect-square`}
        >
          <FaUser className="w-[60%] h-[60%] text-[#3f27c2]" />
        </div>
      )}
    </div>
  );
}

export default function UserMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    email: "username@email.com",
    emailVerified: false,
    name: "",
    picture: "",
  });

  const closeMenu = (event: { relatedTarget: unknown }) => {
    if (!event.relatedTarget) {
      setIsVisible(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const storageItem = localStorage.getItem("userInfo");
    if (storageItem) {
      const { email, emailVerified, name, picture } = JSON.parse(
        storageItem.replace("email_verified", "emailVerified"),
      );

      setUserInfo({
        email: email,
        emailVerified: emailVerified,
        name: name,
        picture: picture,
      });
    }
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      // eslint-disable-next-line
      console.log(code);
    } else {
      const error = urlParams.get("error");
      if (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    }
  }, [location.search]);

  return (
    <div tabIndex={0} onBlur={closeMenu} className="relative">
      <button
        onClick={() => setIsVisible((current) => !current)}
        className="flex justify-center items-center w-10 h-10 p-0 rounded-full border-none outline-none bg-white"
      >
        <UserIcon picture={userInfo.picture} className="w-full h-full" />
      </button>
      {isVisible ? (
        <div className="absolute bg-white rounded-lg right-0 mt-2">
          <ul className="m-0 p-0 list-none text-[#3f27c2]">
            <li className="flex justify-center items-center gap-2 px-4 py-6">
              <UserIcon picture={userInfo.picture} className="w-12 h-12" />
              <ul className="p-0 list-none">
                <li>{userInfo.name}</li>
                <li className="text-sm">{userInfo.email}</li>
              </ul>
            </li>
            <li className="w-full h-fit">
              <span className="block w-full h-[1px] bg-[#3f27c2]"></span>
            </li>
            <li className="h-fit w-full flex">
              <button
                onClick={handleLogout}
                className="px-4 py-2 grow w-full h-full rounded-b-lg no-underline text-[#3f27c2] bg-transparent hover:bg-[#3f27c2] hover:text-white border-none text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
