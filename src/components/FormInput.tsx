import { useState } from "react";

interface FormProps {
  type: string;
  label: string;
  autoFocus: boolean;
}

export default function FormInput(props: FormProps) {
  const { type, label, autoFocus } = props;
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === "password";

  const toggleView = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsVisible((current: boolean) => !current);
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
          className="w-full h-[36px] p-0"
        />
        {isPassword ? (
          <button onClick={toggleView} className="absolute m-0 top-0 right-0">
            *
          </button>
        ) : null}
      </div>
    </div>
  );
}
