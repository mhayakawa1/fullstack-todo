import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  errorId?: string;
  id?: string;
}

export default function TodoContainer(props: ContainerProps) {
  const { children, errorId, id } = props;
  return (
    <div
      className={`${id && errorId === id ? "border-solid border-red-500 border-[1px]" : ""} flex flex-col justify-center items-center gap-4 w-full h-fit box-border rounded-lg p-4 bg-white bg-opacity-25`}
    >
      {children}
    </div>
  );
}
