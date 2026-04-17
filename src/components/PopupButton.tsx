interface PopupButtonProps {
  text: string;
  deleteItem: number;
}

export default function PopupButton(props: PopupButtonProps) {
  const { text, deleteItem } = props;
  return (
    <button
      value={deleteItem}
      className="bg-[#1a45bd] w-16 py-1 px-2 rounded-md hover:bg-white border-solid border-[1px] border-[#1a45bd] text-white hover:text-[#1a45bd] box-border"
    >
      {text}
    </button>
  );
}
