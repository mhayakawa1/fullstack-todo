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

  const login = useGoogleLogin({
    flow: "auth-code",
    // eslint-disable-next-line
    ux_mode: "redirect",
    // eslint-disable-next-line
    redirect_uri: "http://localhost:3000/dashboard",
  });

  return (
    <div className="m-auto flex flex-col justify-center items-center gap-4 p-4 w-[364px] bg-white bg-opacity-25 rounded-lg">
      <form className="w-full flex flex-col gap-4 text-white">
        <h1 className="text-center font-normal">{title}</h1>
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
        <FormButton handleClick={handleSubmit}>{formType}</FormButton>
      </form>
      <FormButton handleClick={login}>
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
