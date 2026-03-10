import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import "../index.css";

interface Error {
  field: string;
  message: string;
}

interface FormProps {
  type: string;
  label: string;
  autoFocus: boolean;
  errorMessage: string;
  updateInput: (label: string, value: string) => void;
  password: string;
  errors: Array<Error>;
}

export default function FormInput(props: FormProps) {
  const {
    type,
    label,
    autoFocus,
    errorMessage,
    updateInput,
    password,
    errors,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);
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
      setCheckVisible(value === password);
    }
    setIsInvalid(isInvalid);
    updateInput(label, value);
  };

  useEffect(() => {
    if (errors && errors.find((error: Error) => error.field === type)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
    errors.find((error: Error) => error.field === type);
  }, [errors]);

  return (
    <div className="flex flex-col">
      <label htmlFor={type} className="cursor-pointer flex gap-2">
        <span>{label}</span>
        {checkVisible && label === "Confirm Password" ? (
          <FaCheck className="text-sm my-auto" />
        ) : null}
      </label>
      <div className="relative">
        <input
          id={label.toLowerCase().replace(" ", "")}
          type={isVisible ? "text" : type}
          name={type}
          placeholder={
            type === "confirm password"
              ? "Confirm password"
              : `Enter your ${type}`
          }
          autoFocus={autoFocus}
          onBlur={checkValidation}
          className={`w-full h-10 px-4 ${
            isInvalid ? "border border-solid border-red-500" : "border-none"
          } bg-white box-border rounded-lg bg-opacity-15 text-white placeholder-white placeholder-opacity-50`}
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
        <div className="h-3 py-1">
          {isInvalid ? (
            <p className="text-red-500 m-0 text-xs">{errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
