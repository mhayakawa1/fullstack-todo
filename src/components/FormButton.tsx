import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  id: string;
}
export default function FormButton(props: ButtonProps) {
  const { children, id } = props;
  return (
    <button
      id={id}
      type="submit"
      className="w-full h-10 p-0 flex items-center justify-center gap-2 border-none rounded-lg bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white"
    >
      {children}
    </button>
  );
}
