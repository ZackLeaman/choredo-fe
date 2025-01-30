import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicChores, selectPublicChores } from "../../slices/choreSlice";
import { selectUser, selectUserSession } from "../../slices";

const BrowseChoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const chores = useSelector(selectPublicChores);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchPublicChores({ accessToken: session.access_token }) as any);
  }, [dispatch, session]);

  return (
    <>
      <h1 className="mb-6">Browse Chores</h1>
      <section className="flex justify-center">
        {user &&
          chores &&
          chores.map((c, index) => (
            <div className="card" key={index}>
              <h2>Name: {c.name}</h2>
              <p>Frequency: {c.frequency_days} days</p>
              <p>Last Completed: {c.completed_on}</p>
              <p>Description: {c.description}</p>
              <p>User: {c.username}</p>
              {/* <p>Tags:</p> */}
              {/* <ul>{c.tags && c.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> */}
            </div>
          ))}
      </section>
    </>
  );
};

export default BrowseChoresPage;
