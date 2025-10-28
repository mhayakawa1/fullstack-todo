import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

interface FormProps {
  title: string;
  formType: string;
  path: string;
  linkText: string;
}

export default function Form(props: FormProps) {
  const { title, formType, path, linkText } = props;
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const navigate = useNavigate();

  const toggleValid = (isEmail: boolean, valid: boolean) => {
    if (isEmail) {
      setValidEmail(valid);
    } else {
      setValidPassword(valid);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (validEmail && validPassword) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className="flex flex-col gap-4 p-4 w-[400px] bg-white bg-opacity-25 box-border rounded-lg text-white">
        <h1 className="text-center font-normal">{title}</h1>
        <FormInput
          type="email"
          label="Email"
          autoFocus={true}
          errorMessage="Invalid email."
          toggleValid={toggleValid}
        />
        <FormInput
          type="password"
          label="Password"
          autoFocus={false}
          errorMessage="Must be at least 8 characters."
          toggleValid={toggleValid}
        />
        <FormButton handleSubmit={handleSubmit}>{formType}</FormButton>
        <FormButton handleSubmit={handleSubmit}>
          {formType} with Google
        </FormButton>
        <Link
          to={`/${path}`}
          className="w-fit m-auto text-sm text-center no-underline hover:underline text-white"
        >
          {linkText}
        </Link>
      </form>
    </div>
  );
}
