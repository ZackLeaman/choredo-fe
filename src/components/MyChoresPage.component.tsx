import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  deleteChore,
  editChore,
  fetchUserChores,
  resetStatus,
  selectStatus,
  selectUserChores,
} from "../slices/choreSlice";
import { useDispatch, useSelector } from "react-redux";
import { AsyncStatus } from "../enums/AsyncStatus";
import { Chore } from "../models";
import { useNavigate } from "react-router";

export interface MyChoresPageProps {
  user: User;
}

const MyChoresPage: React.FC<MyChoresPageProps> = ({ user }) => {
  const dispatch = useDispatch();
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserChores({ user }) as any);
  }, [dispatch, user]);

  useEffect(() => {
    if (status.deleteChore === AsyncStatus.SUCCESSFUL) {
      dispatch(fetchUserChores({ user }) as any);
      dispatch(resetStatus());
    }
  }, [dispatch, user, status]);

  const editHandler = (chore: Chore) => {
    dispatch(editChore(chore) as any);
    navigate("/edit-chore");
  };

  const deleteHandler = (id: string) => {
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
