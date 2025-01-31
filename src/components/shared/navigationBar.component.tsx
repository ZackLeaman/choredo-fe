import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { fetchGetUserProfile, selectUser, selectUserProfileLevel, selectUserProfileProgress, selectUserSession } from "../../slices";
// import Icon from '../../../public/fox-icon.jpg';
import Icon from "../../../public/creature-icon.jpg";
import "./navigationBar.component.css";
import { useEffect } from "react";
import { USER_PROGRESS_MAX } from "../../utils/userLevel";

export interface NavigationBarProps {
  logout: () => void;
  loading: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ logout, loading }) => {
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const upLevel = useSelector(selectUserProfileLevel);
  const upProgress = useSelector(selectUserProfileProgress);
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchGetUserProfile({ accessToken: session.access_token }) as any);
  }, [dispatch, session]);

  const level = upLevel;
  const percentage = Math.floor(upProgress / USER_PROGRESS_MAX * 100);

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
              key={n.to}
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
