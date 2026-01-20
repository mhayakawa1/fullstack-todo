import ListButton from "./ListButton";

interface ButtonsProps {
  page: number;
  total: number;
  updatePage: (isLeft: boolean) => void;
}

export default function ListButtons(props: ButtonsProps) {
  const { page, total, updatePage } = props;

  return (
    <div className="w-full flex justify-between items-center text-white p-0 py-2">
      <ListButton isLeft={true} updatePage={updatePage} />
      <span className="text-sm">Showing {page} of {total}</span>
      <ListButton isLeft={false} updatePage={updatePage} />
    </div>
  );
}
