import PopupButton from "./PopupButton";

interface PopupProps {
  popupTitle: string;
  togglePopup: (
    id: string | number,
    popupTitle: string,
    deleteItem: boolean,
  ) => void;
}

export default function DeletePopup(props: PopupProps) {
  const { popupTitle, togglePopup } = props;
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLButtonElement;
    togglePopup("", "", Boolean(Number(target.value)));
  };
  return (
    <div className="fixed w-full h-[100vh] -mt-16 z-10 bg-white/50 box-border flex items-center">
      <div className="flex flex-col gap-4 w-[40vw] min-w-[275px] h-auto bg-white m-auto rounded-lg text-[#1a45bd] p-4 box-border">
        <div>
          <h2 className="m-0">Delete "{popupTitle}"</h2>
          <p className="text-sm">Are you sure you want to delete this item?</p>
        </div>
        <div onClick={handleClick} className="flex justify-between">
          <PopupButton text="Cancel" deleteItem={0} />
          <PopupButton text="Delete" deleteItem={1} />
        </div>
      </div>
    </div>
  );
}
