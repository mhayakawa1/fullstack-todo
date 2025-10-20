import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handleSubmit: (event: { preventDefault: () => void }) => void;
}
export default function FormButton(props: ButtonProps) {
  const { children, handleSubmit } = props;
  return (
    <button onClick={handleSubmit} className="h-[36px] p-0">
      {children}
    </button>
  );
}
