import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface ButtonProps {
  isLeft: boolean;
  updatePage: (isLeft: boolean) => void;
  //  updateInput: (label: string, value: string) => void;
}

export default function ListButton(props: ButtonProps) {
  const { isLeft, updatePage } = props;
  const iconClasses = "text-white text-2xl m-0";
  return (
    <button
      onClick={() => updatePage(isLeft)}
      className="border-none bg-transparent flex justify-between items-center p-0"
    >
      {isLeft ? (
        <FaChevronCircleLeft className={`${iconClasses}`} />
      ) : (
        <FaChevronCircleRight className={`${iconClasses}`} />
      )}
    </button>
  );
}
