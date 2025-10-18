import { Link } from "react-router-dom";
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
  return (
    <div className="flex justify-center items-center">
      <form className="border-solid flex flex-col gap-3 p-3">
        <h1>{title}</h1>
        <FormInput type="email" label="Email" autoFocus={true} />
        <FormInput type="password" label="Password" autoFocus={false} />
        <FormButton>{formType}</FormButton>
        <FormButton>{formType} with Google</FormButton>
        <Link to={`/${path}`} className="no-underline hover:underline">
          {linkText}
        </Link>
      </form>
    </div>
  );
}
