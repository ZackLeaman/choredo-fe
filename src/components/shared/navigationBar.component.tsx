import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import { selectUser } from "../../slices";

export interface NavigationBarProps {
  logout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ logout }) => {
  const user = useSelector(selectUser);

  return (
    <header className="absolute top-0 left-0 right-0 m-6">
      <section className="flex justify-between items-end my-3">
        <h1 className="text-left">Choredo</h1>
        <h2>{user && user.email ? user.email.split("@")[0] : ''}</h2>
      </section>
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
        <div className="flex-1 text-right">
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;
