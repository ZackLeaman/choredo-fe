import { useEffect } from "react";
import {
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
import { selectUser } from "../../slices";

const MyChoresPage: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectChoreStatus);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchUserChores({ user }) as any);
  }, [dispatch, user]);

  useEffect(() => {
    if (status.deleteChore === AsyncStatus.SUCCESSFUL) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchUserChores({ user }) as any);
      dispatch(resetStatus());
    }
  }, [dispatch, user, status]);

  const editHandler = (chore: Chore) => {
    navigate(`/edit-chore/${chore.id}`);
  };

  const deleteHandler = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(deleteChore({ id }) as any);
  };

  return (
    <>
      <h1>{user ? `${user.email} - ` : ""}Choredos</h1>
      {user &&
        chores &&
        chores.map((c, index) => (
          <div className="card" key={index}>
            <button onClick={() => editHandler(c)}>Edit</button>
            <button onClick={() => deleteHandler(c.id)}>X</button>
            <h2>Name: {c.name}</h2>
            <p>Frequency: {c.frequency_days} days</p>
            <p>Last Completed: {c.completed_on}</p>
            <p>Description: {c.description}</p>
            {/* <p>Tags:</p> */}
            {/* <ul>{c.tags && c.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> */}
          </div>
        ))}
    </>
  );
};

export default MyChoresPage;
