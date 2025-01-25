import { NavLink } from "react-router";

export interface NavigationBarProps {
  logout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ logout }) => {
  return (
    <nav className="flex gap-9 items-center mb-5">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "text-lime-500" : "")}
      >
        My Chores
      </NavLink>
      <NavLink
        to="/chores"
        end
        className={({ isActive }) => (isActive ? "text-lime-500" : "")}
      >
        Browse Chores
      </NavLink>
      <NavLink
        to="/create-chore"
        end
        className={({ isActive }) => (isActive ? "text-lime-500" : "")}
      >
        Create a Chore
      </NavLink>
      <button className="btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default NavigationBar;
