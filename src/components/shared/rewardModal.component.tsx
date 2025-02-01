import { useDispatch, useSelector } from "react-redux";
import {
  addAchievement,
  fetchPostUserProfile,
  selectUserProfile,
  selectUserSession,
} from "../../slices";
import { useEffect, useState } from "react";
import './rewardModal.component.css';

const RewardModalComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { level_up_increase } = useSelector(selectUserProfile);
  const session = useSelector(selectUserSession);
  const [loading, setLoading] = useState(false);
  const [rewardSrc, setRewardSrc] = useState("");
  const [dismissReward, setDismissReward] = useState(true);

  useEffect(() => {
    if (level_up_increase > 0 && dismissReward) {
      setDismissReward(false);
    }
  }, [level_up_increase, dismissReward]);

  const onClickReward = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND}/achievement/reward`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      method: "GET",
    })
      .then((res) => {
        if (res) {
          return res.json();
        }
        throw new Error("invalid response from server");
      })
      .then((resSrc) => {
        console.log(resSrc);
        setRewardSrc(resSrc);
        setLoading(false);
        dispatch(
          fetchPostUserProfile({
            accessToken: session.access_token,
            level_up_increase: Math.max(level_up_increase - 1, 0),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(addAchievement({ id: 9999, location: resSrc }) as any);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const onClose = () => {
    if (level_up_increase <= 0) {
      setDismissReward(true);
    }
    setRewardSrc("");
    setLoading(false);
  };

  if ((!level_up_increase || level_up_increase <= 0) && dismissReward) {
    return <></>;
  }

  return (
    <div className="backdrop">
      <div className="modal">
        {!loading && !rewardSrc && (
          <button onClick={onClickReward}>Search the grass?</button>
        )}
        {loading && <div>Something is moving in the grass...</div>}
        {!loading && rewardSrc && (
          <div>
            <button className="btn-close bg-red-600" onClick={onClose}>X</button>
            <div style={{ position: "relative" }}>
              <img className="achievement-reflection" src={rewardSrc} />
              <img className="achievement" src={rewardSrc} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardModalComponent;
