import { Link } from "react-router-dom";

interface LinkProps {
  path: string;
  name: string;
}
export default function NavLink(props: LinkProps) {
  const { path, name } = props;
  return (
    <li>
      <Link to={`/${path}`} className="border-solid no-underline">
        {name}
      </Link>
    </li>
  );
}
