import { useEffect, useState } from "react";
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
import { usePopper } from "react-popper";
import "./myChoresPage.component.css";

const MyChoresPage: React.FC = () => {
  const user = useSelector(selectUser);
  const session = useSelector(selectUserSession);
  const dispatch = useDispatch();
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectChoreStatus);
  const navigate = useNavigate();
  const [popoverRef, setPopoverRef] = useState<HTMLElement | null>(null);
  const [popoverContentRef, setPopoverContentRef] =
    useState<HTMLElement | null>(null);
  const [popoverEditRef, setPopoverEditRef] = useState<HTMLElement | null>(
    null
  );
  const [popoverDeleteRef, setPopoverDeleteRef] = useState<HTMLElement | null>(
    null
  );
  const { styles, attributes } = usePopper(popoverRef, popoverContentRef, {
    placement: "bottom-start",
    modifiers: [
      { name: "edit", options: { element: popoverEditRef } },
      { name: "delete", options: { element: popoverDeleteRef } },
    ],
  });
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

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

  const completeHandler = (choreId: string) => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completeChore({ choreId, accessToken: session.access_token }) as any
    );
  };

  const optionsHandler = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  return (
    <>
      <h1 className="mb-6">My Chores</h1>
      <section className="flex justify-center">
        {user &&
          chores &&
          chores.map((c, index) => (
            <div className="card chore" key={index}>
              <button
                className="complete bg-lime-600"
                onClick={() => completeHandler(c.id)}
              >
                Complete
              </button>
              <button
                ref={setPopoverRef}
                data-popover-target="popover-chore-options"
                className="options"
                onClick={optionsHandler}
              >
                ...
              </button>
              {isOptionsOpen && <ul
                className="options-popover"
                ref={setPopoverContentRef}
                style={styles.popper}
                {...attributes.popper}
              >
                <li>
                  <button
                    className="edit bg-cyan-900 mb-2 w-full"
                    onClick={() => editHandler(c)}
                    ref={setPopoverEditRef}
                    style={styles.arrow}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="delete bg-red-600 w-full"
                    onClick={() => deleteHandler(c.id)}
                    ref={setPopoverDeleteRef}
                    style={styles.arrow}
                  >
                    Delete
                  </button>
                </li>
              </ul>}
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
