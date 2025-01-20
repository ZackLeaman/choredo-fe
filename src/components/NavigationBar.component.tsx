import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { editChore } from "../slices/choreSlice";

export interface NavigationBarProps {
  logout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ logout }) => {
  const dispatch = useDispatch();

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
        onClick={() => dispatch(editChore(null))}
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
