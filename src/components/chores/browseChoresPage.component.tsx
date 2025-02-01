import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserSession, fetchPublicChores, selectPublicChores  } from "@/slices";
import './browseChoresPage.component.css';
import { Chore } from "@/models";
import { useNavigate } from "react-router";

const BrowseChoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const chores = useSelector(selectPublicChores);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchPublicChores({ accessToken: session.access_token }) as any);
  }, [dispatch, session]);

  const copyMeHandler = (chore: Chore) => {
    navigate(`/edit-chore/${chore.id}`);
  } 

  return (
    <>
      <h1 className="mb-6 mt-14">Browse Chores</h1>
      <section className="flex flex-wrap justify-center mb-20">
        {user &&
          chores &&
          chores.map((c, index) => (
            <div className="card chore" key={index}>
              <button
                className="complete bg-lime-600"
                onClick={() => copyMeHandler(c)}
              >
                Copy Me
              </button>
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
