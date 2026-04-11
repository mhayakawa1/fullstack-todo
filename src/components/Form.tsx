import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaCheck, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import loading from "../loading.gif";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

interface FormProps {
  title: string;
  formType: string;
  path: string;
  linkText: string;
}

interface Body {
  email?: string;
  name?: string;
  password?: string;
  tokenResponse?: {
    //eslint-disable-next-line
    access_token: string;
    authuser?: string;
    //eslint-disable-next-line
    expires_in: number;
    prompt: string;
    scope: string;
    //eslint-disable-next-line
    token_type: string;
  };
  userProfile?: {
    email: string;
    //eslint-disable-next-line
    email_verified: boolean;
    //eslint-disable-next-line
    family_name: string;
    //eslint-disable-next-line
    given_name: string;
    name: string;
    picture: string;
    sub: string;
  };
}

export default function Form(props: FormProps) {
  const { title, formType, path, linkText } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    fetch(
      `${process.env.NODE_ENV === "production" ? "https://fullstack-todo-app-server.onrender.com" : "https://localhost:8080"}/api/auth/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      },
    )
      .then((response) => {
        setIsLoading(false);
        if (!response.ok) {
          return response.json().then((data) => {
            const { errors } = data;
            setErrors(errors);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data === 200) {
          //eslint-disable-next-line
          console.clear();
          navigate("/dashboard");
        }
        if (data.message === "User registered.") {
          setSuccessVisible(true);
          setErrorVisible(false);
        }
      })
      .catch(() => {
        setErrorVisible(true);
      });
  }

  const login = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (email && password) {
      setIsLoading(true);
      //eslint-disable-next-line
      console.log("loading");
      makeRequest({ email: email, password: password }, "login");
    }
  };

  const signup = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (name && email && password && password === confirmPassword) {
      setIsLoading(true);
      makeRequest({ name: name, email: email, password: password }, "signup");
    }
  };

  async function getUserProfile(accessToken: string) {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();
    return data;
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //eslint-disable-next-line
      const { access_token } = tokenResponse;
      //eslint-disable-next-line
      const userProfile = await getUserProfile(access_token);
      if (userProfile) {
        setIsLoading(true);
        //eslint-disable-next-line
        console.log("loading");
        makeRequest(
          { tokenResponse: tokenResponse, userProfile: userProfile },
          "google/callback",
        );
      }
    },
  });

  const toLogin = () => {
    navigate("/login");
  };
  //eslint-disable-next-line
  console.log(isLoading);
  return (
    <div className="relative m-auto flex flex-col justify-center items-center gap-3 p-4 max-w-[364px] max-sm:w-[90vw] bg-white bg-opacity-25 rounded-lg box-border">
      <form className="w-full flex flex-col gap-3 text-white">
        <h1 className="text-center font-normal">{title}</h1>
        <div
          className={`${successVisible || isLoading ? "pointer-events-none opacity-50" : ""} w-full flex flex-col gap-3`}
        >
          {isSignup ? (
            <FormInput
              type="name"
              label="Name"
              autoFocus={true}
              errorMessage="Please enter your name."
              updateInput={updateInput}
              password=""
              errors={errors}
            />
          ) : null}
          <FormInput
            type="email"
            label="Email"
            autoFocus={!isSignup}
            errorMessage="Please enter a valid email."
            updateInput={updateInput}
            password=""
            errors={errors}
          />
          <FormInput
            type="password"
            label="Password"
            autoFocus={false}
            errorMessage="Password must be at least 8 characters."
            updateInput={updateInput}
            password={confirmPassword}
            errors={errors}
          />
          {isSignup ? (
            <FormInput
              type="password"
              label="Confirm Password"
              autoFocus={false}
              errorMessage="Passwords do not match."
              updateInput={updateInput}
              password={password}
              errors={errors}
            />
          ) : null}
          {errorVisible && !isLoading ? (
            <div className="w-full h-fit mb-2 bg-white bg-opacity-40 rounded-lg">
              <p className="text-xs text-center text-red-500">
                Invalid email or password.
              </p>
            </div>
          ) : null}
          <FormButton handleClick={isSignup ? signup : login}>
            {formType}
          </FormButton>
        </div>
      </form>
      <div
        className={`${successVisible || isLoading ? "pointer-events-none opacity-50" : ""} w-full`}
      >
        <FormButton handleClick={loginWithGoogle}>
          <FaGoogle />
          <span>{formType} with Google</span>
        </FormButton>
      </div>
      <Link
        to={`/${path}`}
        className="w-fit m-0 text-sm text-center no-underline hover:underline text-white"
      >
        {linkText}
      </Link>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center gap-[5px]">
          <p className="text-xs text-center text-white m-0">Loading...</p>
          <img src={loading} alt="" className="w-[30px]"></img>
        </div>
      ) : null}
      {isSignup && successVisible ? (
        <ul className="m-0 list-none text-white text-center w-full p-0 flex flex-col gap-4">
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
