import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserSession } from "../../slices";

const AchievementsPage: React.FC = () => {
  const session = useSelector(selectUserSession);
  const [src, setSrc] = useState("");

  const onClickReward = () => {
    fetch(`http://localhost:3000/achievement/reward`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((resSrc) => {
        setSrc(resSrc);
      });
  };

  return (
    <>
      <h1 className="mb-6">Achievements</h1>
      <section className="flex justify-center">
        <button onClick={onClickReward}>Get reward</button>
        <img src={src} />
      </section>
    </>
  );
};

export default AchievementsPage;
