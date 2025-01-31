import { useEffect } from "react";
import {
  completeChore,
  deleteChore,
  fetchUserChores,
  resetStatus,
  selectChoreStatus,
  selectUserChores,
} from "../../slices/choreSlice";
import { useDispatch, useSelector } from "react-redux";
import { AsyncStatus } from "../../enums/asyncStatus";
import { Chore } from "../../models";
import { useNavigate } from "react-router";
import {
  fetchPostUserProfile,
  selectUser,
  selectUserProfile,
  selectUserSession,
} from "../../slices";
import "./myChoresPage.component.css";
import { updateUserProgress } from "../../utils/userLevel";
import ChoreWithOptionsComponent from "../shared/choreWithOptions.component";

const MyChoresPage: React.FC = () => {
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const dispatch = useDispatch();
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectChoreStatus);
  const userProfile = useSelector(selectUserProfile);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchUserChores({ accessToken: session.access_token }) as any);
  }, [dispatch, session]);

  useEffect(() => {
    if (status.deleteChore === AsyncStatus.SUCCESSFUL) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchUserChores({ accessToken: session.access_token }) as any);
      dispatch(resetStatus());
    }
  }, [dispatch, session, status]);

  const editHandler = (chore: Chore) => {
    navigate(`/edit-chore/${chore.id}`);
  };

  const deleteHandler = (choreId: string) => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteChore({ choreId, accessToken: session.access_token }) as any
    );
  };

  const completeHandler = (chore: Chore) => {
    dispatch(
      completeChore({
        choreId: chore.id,
        accessToken: session.access_token,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );

    const { level, progress } = updateUserProgress(
      userProfile.level,
      userProfile.progress,
      chore.frequency_days
    );

    dispatch(
      fetchPostUserProfile({
        accessToken: session.access_token,
        chores_completed: userProfile.chores_completed + 1,
        level,
        progress,
        level_up_increase: level - userProfile.level,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );
  };

  return (
    <>
      <h1 className="mb-6 mt-14">My Chores</h1>
      <section className="flex flex-wrap justify-center gap-10 mb-20">
        {user &&
          chores &&
          chores.map((c, index) => (
            <ChoreWithOptionsComponent
              key={`${c.id}-${index}`}
              chore={c}
              onCompleteHandler={completeHandler}
              onDeleteHandler={deleteHandler}
              onEditHandler={editHandler}
            />
          ))}
      </section>
    </>
  );
};

export default MyChoresPage;
