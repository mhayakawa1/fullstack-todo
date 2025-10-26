import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function TaskContainer(props: ContainerProps) {
  const { children } = props;
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-[400px] h-fit box-border rounded-lg p-4 bg-white bg-opacity-25">
      {children}
    </div>
  );
}
