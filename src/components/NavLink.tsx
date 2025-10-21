import { Link } from "react-router-dom";

interface LinkProps {
  className: string;
  path: string;
  name: string;
}
export default function NavLink(props: LinkProps) {
  const { className, path, name } = props;
  return (
    <li className={className}>
      <Link to={`/${path}`} className="no-underline">
        {name}
      </Link>
    </li>
  );
}
