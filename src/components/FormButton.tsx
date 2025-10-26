import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handleSubmit: (event: { preventDefault: () => void }) => void;
}
export default function FormButton(props: ButtonProps) {
  const { children, handleSubmit } = props;
  return (
    <button
      onClick={handleSubmit}
      className="h-10 p-0 border-none rounded-lg bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white"
    >
      {children}
    </button>
  );
}
