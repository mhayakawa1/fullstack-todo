import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
import { FaGoogle } from "react-icons/fa";

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
  const formRef = useRef<HTMLFormElement>(null);
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    ["client_id"]:
      "337374147821-5pqh07hmagj58a6cfinpp971gfj49512.apps.googleusercontent.com",
    ["redirect_uri"]: "http://localhost:3000/dashboard",
    ["response_type"]: "token",
    ["scope"]:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    ["include_granted_scopes"]: "true",
    ["state"]: "pass-through value",
  };

  const navigate = useNavigate();

  const toggleValid = (isEmail: boolean, valid: boolean) => {
    if (isEmail) {
      setValidEmail(valid);
    } else {
      setValidPassword(valid);
    }
  };

  const renderInputs = () => {
    const inputs = [];
    for (const p in params) {
      const value = p as keyof typeof params;
      inputs.push(
        <input type="hidden" key={p} name={p} value={params[value]} />
      );
    }
    return inputs;
  };

  const handleSubmit = (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    const { submitter } = event.nativeEvent;
    if (submitter) {
      if (submitter.id === "login-with-google" && formRef.current) {
        formRef.current.submit();
      } else if (validEmail && validPassword) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <script src="https://accounts.google.com/gsi/client" async></script>{" "}
      <div className="flex flex-col gap-4 p-4 w-[400px] bg-white bg-opacity-25 box-border rounded-lg text-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <FormButton id="login">{formType}</FormButton>
        </form>
        <form
          ref={formRef}
          method="GET"
          action={oauth2Endpoint}
          onSubmit={handleSubmit}
          className="w-full"
        >
          {renderInputs()}
          <FormButton id="login-with-google">
            <FaGoogle />
            <span>{formType} with Google</span>
          </FormButton>
        </form>
        <Link
          to={`/${path}`}
          className="w-fit m-auto text-sm text-center no-underline hover:underline text-white"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
