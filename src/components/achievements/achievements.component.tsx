import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAchievements,
  selectUserProfile,
  selectUserSession,
} from "../../slices";

const AchievementsPage: React.FC = () => {
  const session = useSelector(selectUserSession);
  const { achievements } = useSelector(selectUserProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchUserAchievements({ accessToken: session.access_token }) as any
    );
  }, [session, dispatch]);

  return (
    <>
      <h1 className="mb-20">Achievements</h1>
      <section className="flex justify-center gap-3 px-20">
        {achievements &&
          achievements.map((a, i) => (
            <div key={`${a}-${i}`} style={{ position: "relative" }}>
              <img className="achievement-reflection" src={a.location} />
              <img className="achievement" src={a.location} />
            </div>
          ))}
      </section>
    </>
  );
};

export default AchievementsPage;
