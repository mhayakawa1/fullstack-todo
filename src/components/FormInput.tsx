import { useState } from "react";

interface FormProps {
  type: string;
  label: string;
  autoFocus: boolean;
  errorMessage: string;
  toggleValid: (isEmail: boolean, valid: boolean) => void;
}

export default function FormInput(props: FormProps) {
  const { type, label, autoFocus, errorMessage, toggleValid } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const isPassword = type === "password";

  const toggleView = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsVisible((current: boolean) => !current);
  };

  const checkValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const isEmail = type === "email";
    let valid;
    if (isEmail) {
      valid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setIsInvalid(valid);
    } else {
      valid = value.length < 8;
      setIsInvalid(valid);
    }
    toggleValid(isEmail, !valid);
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
          placeholder={`Enter your ${type}`}
          autoFocus={autoFocus}
          onBlur={checkValidation}
          className="w-full h-[36px] box-border p-0 pl-2"
          required
        />
        {isPassword ? (
          <button
            onClick={toggleView}
            className="absolute m-0 top-1/2 transform -translate-y-1/2 right-1"
          >
            *
          </button>
        ) : null}
      </div>
      {window.location.pathname === "/signup" ? (
        <div className="h-4 p-0">
          {isInvalid ? (
            <p className="text-red-500 m-0 text-xs">{errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
