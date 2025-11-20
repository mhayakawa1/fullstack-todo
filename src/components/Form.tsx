import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaCheck, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

interface FormProps {
  title: string;
  formType: string;
  path: string;
  linkText: string;
}

interface User {
  email: string;
  id: string;
  name: string;
  password: string;
  picture: string;
  userId: string;
}

export default function Form(props: FormProps) {
  const { title, formType, path, linkText } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("Invalid email or password.");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const isSignup = formType === "Sign up";
  const navigate = useNavigate();

  const updateInput = (label: string, value: string) => {
    if (label === "Email") {
      setEmail(value);
    } else if (label === "Password") {
      setPassword(value);
    } else if (label === "Confirm Password") {
      setConfirmPassword(value);
    } else {
      setName(value);
    }
  };

  function findUser(users: User[]) {
    const user = users.find((user: User) => user.email === email);
    if (isSignup || (user && user.password === password)) {
      return user;
    }
    return undefined;
  }

  async function verifyUser() {
    const url = "https://69021b50b208b24affe50764.mockapi.io/todo/users";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    const user = findUser(users);
    if (isSignup) {
      if (user) {
        setErrorVisible(true);
      } else {
        const userNum = users.length + 1;
        const user = {
          email: email,
          id: userNum.toString(),
          name: name,
          password: password,
          picture: "",
          userId: `userId${userNum}`,
        };
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            localStorage.setItem("userId", data.userId);
            setSuccessVisible(true);
          })
          .catch((error) => {
            setErrorText(error);
          });
      }
    } else {
      if (user) {
        navigate("/dashboard");
      } else {
        setErrorVisible(true);
      }
    }
  }

  const login = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (email && password) {
      verifyUser();
    }
  };

  const signup = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    verifyUser();
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    // eslint-disable-next-line
    ux_mode: "redirect",
    // eslint-disable-next-line
    redirect_uri: "http://localhost:3000/dashboard",
  });

  const toLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative m-auto flex flex-col justify-center items-center gap-4 p-4 w-[364px] bg-white bg-opacity-25 rounded-lg">
      <form className="w-full flex flex-col gap-2 text-white">
        <h1 className="text-center font-normal">{title}</h1>
        {isSignup ? (
          <FormInput
            type="name"
            label="Name"
            autoFocus={true}
            errorMessage="Please enter your name."
            updateInput={updateInput}
            password=""
          />
        ) : null}
        <FormInput
          type="email"
          label="Email"
          autoFocus={!isSignup}
          errorMessage="Please enter a valid email."
          updateInput={updateInput}
          password=""
        />
        <FormInput
          type="password"
          label="Password"
          autoFocus={false}
          errorMessage="Password must be at least 8 characters."
          updateInput={updateInput}
          password={confirmPassword}
        />
        {isSignup ? (
          <FormInput
            type="password"
            label="Confirm Password"
            autoFocus={false}
            errorMessage="Passwords do not match."
            updateInput={updateInput}
            password={password}
          />
        ) : null}
        {errorVisible ? (
          <div className="w-full h-fit mb-2 bg-white bg-opacity-40 rounded-lg">
            <p className="text-xs text-center text-red-500">{errorText}</p>
          </div>
        ) : null}
        <FormButton handleClick={isSignup ? signup : login}>
          {formType}
        </FormButton>
      </form>
      <FormButton handleClick={loginWithGoogle}>
        <FaGoogle />
        <span>{formType} with Google</span>
      </FormButton>
      <Link
        to={`/${path}`}
        className="w-fit m-auto text-sm text-center no-underline hover:underline text-white"
      >
        {linkText}
      </Link>
      {isSignup && successVisible ? (
        <ul className="list-none text-white text-center w-full p-0 flex flex-col gap-4">
          <li>Success!</li>
          <li className="text-4xl border-solid rounded-full w-20 h-20 flex justify-center items-center mx-auto">
            <FaCheck />
          </li>
          <li>
            <FormButton handleClick={toLogin}>Continue</FormButton>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
