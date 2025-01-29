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
import { selectUser, selectUserSession } from "../../slices";

const MyChoresPage: React.FC = () => {
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const dispatch = useDispatch();
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectChoreStatus);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(deleteChore({ choreId, accessToken: session.access_token  }) as any);
  };

  const completeHandler = (choreId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(completeChore({ choreId, accessToken: session.access_token }) as any);
  }

  return (
    <>
      <h1 className="mb-6 text-cyan-500">My Chores</h1>
      <section className="flex justify-center">
        {user &&
          chores &&
          chores.map((c, index) => (
            <div className="card" key={index}>
              <div className="flex justify-center gap-5 mb-2">
                <button onClick={() => completeHandler(c.id)}>Complete</button>
                <button onClick={() => editHandler(c)}>Edit</button>
                <button onClick={() => deleteHandler(c.id)}>X</button>
              </div>
              <h2>Name: {c.name}</h2>
              <p>Frequency: {c.frequency_days} days</p>
              <p>Last Completed: {c.completed_on}</p>
              <p>Description: {c.description}</p>
              {/* <p>Tags:</p> */}
              {/* <ul>{c.tags && c.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> */}
            </div>
          ))}
      </section>
    </>
  );
};

export default MyChoresPage;
