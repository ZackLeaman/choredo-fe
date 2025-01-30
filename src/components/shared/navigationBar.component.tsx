import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import { selectUser } from "../../slices";
// import Icon from '../../../public/fox-icon.jpg';
import Icon from "../../../public/creature-icon.jpg";
import "./navigationBar.component.css";

export interface NavigationBarProps {
  logout: () => void;
  loading: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ logout, loading }) => {
  const user = useSelector(selectUser);
  const level = 30000;
  const percentage = 80;

  const navLinks = [
    {
      to: "/",
      label: "My Chores",
    },
    {
      to: "/chores",
      label: "Browse Chores",
    },
    {
      to: "/create-chore",
      label: "Create a Chore",
    },
    {
      to: "/achievements",
      label: "Achievements",
    },
  ];

  return (
    <header>
      <section className="flex justify-between items-end py-3 p-6 pt-10 chore-header">
        <div className="flex gap-2 items-end">
          <img className="icon" src={Icon} />
          <h1 className="text-left">Choredo</h1>
        </div>
        <div className="flex flex-nowrap items-center gap-2 user-profile">
          <div className="user-level">
            <div>Level</div>
            <div>{level}</div>
          </div>
          <div>
            <h2>{user && user.email ? user.email.split("@")[0] : ""}</h2>
            <div className="user-profile-progress-shell">
              <div
                className="user-profile-progress-meter"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>
      <nav className="flex gap-9 items-end m-3 mb-5">
        {navLinks &&
          navLinks.map((n) => (
            <NavLink
              to={n.to}
              end
              className={({ isActive }) => (isActive ? "text-lime-500" : "")}
            >
              {n.label}
            </NavLink>
          ))}
        <div className="flex-1 text-right">
          <button className="btn" onClick={logout} disabled={loading}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;
