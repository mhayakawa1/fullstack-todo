import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../index.css";

interface FormProps {
  type: string;
  label: string;
  autoFocus: boolean;
  errorMessage: string;
  updateInput: (label: string, value: string) => void;
  password: string | null;
}

export default function FormInput(props: FormProps) {
  const { type, label, autoFocus, errorMessage, updateInput, password } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const isPassword = label.includes("Password");

  const toggleView = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsVisible((current: boolean) => !current);
  };

  const checkValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    let isInvalid = false;
    if (label === "Name") {
      isInvalid = !value.length;
    } else if (label === "Email") {
      isInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (label === "Password") {
      isInvalid = value.length < 8;
    } else if (label === "Confirm Password") {
      isInvalid = value !== password;
    }    
    setIsInvalid(isInvalid);
    updateInput(label, value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={type} className="cursor-pointer">
        {label}
      </label>
      <div className="relative">
        <input
          id={type}
          type={isVisible ? "text" : type}
          name={type}
          placeholder={
            type === "confirm password"
              ? "Confirm password"
              : `Enter your ${type}`
          }
          autoFocus={autoFocus}
          onBlur={checkValidation}
          className="w-full h-10 px-4 border-none box-border rounded-lg bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-50"
          required
        />
        {isPassword ? (
          <button
            onClick={toggleView}
            className="flex justify-center items-center text-xl border-none bg-transparent absolute m-0 mr-2 top-1/2 transform -translate-y-1/2 right-1 p-0 text-white"
          >
            {isVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        ) : null}
      </div>
      {window.location.pathname === "/signup" ? (
        <div className="h-4 py-1">
          {isInvalid ? (
            <p className="text-red-500 m-0 text-xs">{errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
