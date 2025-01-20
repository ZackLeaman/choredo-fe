import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicChores, selectPublicChores } from "../slices/choreSlice";

export interface BrowseChoresPageProps {
  user: User;
}

const BrowseChoresPage: React.FC<BrowseChoresPageProps> = ({ user }) => {
  const dispatch = useDispatch();
  const chores = useSelector(selectPublicChores);

  useEffect(() => {
    dispatch(fetchPublicChores({ user }) as any);
  }, [dispatch, user]);

  return (
    <>
      <h1>{user ? `${user.email} - ` : ""}Choredos</h1>
      {user &&
        chores &&
        chores.map((c, index) => (
          <div className="card" key={index}>
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

export default BrowseChoresPage;
