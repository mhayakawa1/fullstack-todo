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
      <form className="border-solid flex flex-col gap-3 p-3">
        <h1>{title}</h1>
        <FormInput
          type="email"
          label="Email"
          autoFocus={true}
          errorMessage="Please enter a valid email."
          toggleValid={toggleValid}
        />
        <FormInput
          type="password"
          label="Password"
          autoFocus={false}
          errorMessage="Password must be at least 8 characters."
          toggleValid={toggleValid}
        />
        <FormButton handleSubmit={handleSubmit}>{formType}</FormButton>
        <FormButton handleSubmit={handleSubmit}>
          {formType} with Google
        </FormButton>
        <Link to={`/${path}`} className="no-underline hover:underline">
          {linkText}
        </Link>
      </form>
    </div>
  );
}
