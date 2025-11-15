import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handleClick: (() => void) | ((event: { preventDefault: () => void }) => void);
}
export default function FormButton(props: ButtonProps) {
  const { children, handleClick } = props;
  return (
    <button
      type="button"
      onClick={handleClick}
      className="h-10 p-0 w-full flex items-center justify-center gap-2 border-none rounded-lg bg-white hover:bg-[#3f27c2] text-[#3f27c2] hover:text-white"
    >
      {children}
    </button>
  );
}
