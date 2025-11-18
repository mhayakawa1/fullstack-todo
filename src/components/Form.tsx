import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
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
  const [isInvalid, setIsInvalid] = useState(false);
  const isSignup = formType === "Sign up";
  const navigate = useNavigate();

  const updateInput = (label: string, value: string) => {
    if (label === "Email") {
      setEmail(value);
    } else if (label === "Password") {
      setPassword(value);
    } else {
      setName(value);
    }
  };

  async function verifyUser() {
    const url = "https://f3e190faa41e444ca59dfb2bde65c42a.api.mockbin.io/";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    let user = users.find(
      (user: User) => user.email === email && user.password === password
    );
    if (user) {
      localStorage.setItem("userId", user.userId);
      navigate("/dashboard");
    } else {
      if (isSignup) {
        const userNumber = String(users.length + 1);
        user = {
          email: email,
          name: name,
          picture: "",
          password: password,
          userId: `userId${userNumber}`,
          id: userNumber,
        };
      } else {
        setIsInvalid(true);
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
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    // eslint-disable-next-line
    ux_mode: "redirect",
    // eslint-disable-next-line
    redirect_uri: "http://localhost:3000/dashboard",
  });

  return (
    <div className="m-auto flex flex-col justify-center items-center gap-4 p-4 w-[364px] bg-white bg-opacity-25 rounded-lg">
      <form className="w-full flex flex-col gap-3 text-white">
        <h1 className="text-center font-normal">{title}</h1>
        {isInvalid ? (
          <div className="w-full h-fit bg-white bg-opacity-40 rounded-lg">
            <p className="text-xs text-center text-red-500">
              Invalid email or password.
            </p>
          </div>
        ) : null}
        {isSignup ? (
          <FormInput
            type="name"
            label="Name"
            autoFocus={true}
            errorMessage="Please enter your name."
            updateInput={updateInput}
            password={null}
          />
        ) : null}
        <FormInput
          type="email"
          label="Email"
          autoFocus={!isSignup}
          errorMessage="Please enter a valid email."
          updateInput={updateInput}
          password={null}
        />
        <FormInput
          type="password"
          label="Password"
          autoFocus={false}
          errorMessage="Password must be at least 8 characters."
          updateInput={updateInput}
          password={null}
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
    </div>
  );
}
