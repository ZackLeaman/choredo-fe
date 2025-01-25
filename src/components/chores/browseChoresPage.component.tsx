import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicChores, selectPublicChores } from "../../slices/choreSlice";
import { selectUser } from "../../slices";

const BrowseChoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const chores = useSelector(selectPublicChores);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
