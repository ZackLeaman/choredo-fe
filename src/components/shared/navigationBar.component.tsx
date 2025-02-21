import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import {
  fetchGetUserProfile,
  selectUser,
  selectUserProfileLevel,
  selectUserProfileProgress,
  selectUserSession,
} from "@/slices";
import "./navigationBar.component.css";
import { useEffect } from "react";
import { USER_PROGRESS_MAX } from "@/utils/userLevel";
import { WeatherWidget } from "@daniel-szulc/react-weather-widget";

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
  const percentage = Math.floor((upProgress / USER_PROGRESS_MAX) * 100);

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
      <div className="weather-widget">
        <span>
          Thank you Daniel Szulc for this weather component!{" "}
          <a href="https://github.com/daniel-szulc/react-weather-widget" target="_blank">
            Visit their project here
          </a>
        </span>
        <WeatherWidget autoLocate="gps" tempUnit="F" windSpeedUnit="mph" />
      </div>
      <section className="flex justify-between items-end py-3 p-6 pt-10 chore-header">
        <div className="flex gap-2 items-end">
          <img className="icon" src="/choredo-fe/creature-icon.jpg" />
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
      <nav className="flex gap-9 items-end justify-center m-3 mb-5">
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
      </nav>
      <button
        className="btn btn-logout bg-green-700"
        onClick={logout}
        disabled={loading}
      >
        Logout
      </button>
    </header>
  );
};

export default NavigationBar;
