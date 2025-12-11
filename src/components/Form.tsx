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

interface Body {
  email: string;
  name?: string;
  password: string;
}

export default function Form(props: FormProps) {
  const { title, formType, path, linkText } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
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

  async function makeRequest(body: Body, path: string) {
    fetch(`http://localhost:8080/api/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (path === "login") {
          sessionStorage.setItem("token", data.token);
          navigate("/dashboard");
        }
      })
      .catch(() => {
        setErrorVisible(true);
      });
  }

  const login = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (email && password) {
      makeRequest({ email: email, password: password }, "login");
    }
  };

  const signup = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (name && email && password) {
      makeRequest({ name: name, email: email, password: password }, "signup");
    }
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
            <p className="text-xs text-center text-red-500">
              Invalid email or password.
            </p>
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
      {isSignup ? (
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
