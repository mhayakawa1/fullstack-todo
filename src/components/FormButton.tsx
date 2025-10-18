import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;

}
export default function FormButton(props: ButtonProps) {
  const { children } = props;
  return <button className="h-[36px]">{children}</button>;
}
