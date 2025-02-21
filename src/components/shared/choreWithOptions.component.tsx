import { useCallback, useState } from "react";
import { Chore } from "@/models";
import { usePopper } from "react-popper";

interface ChoreWithOptionsComponentProps {
  chore: Chore;
  onCompleteHandler: (chore: Chore) => void;
  onEditHandler: (chore: Chore) => void;
  onDeleteHandler: (id: string) => void;
}

const ChoreWithOptionsComponent: React.FC<ChoreWithOptionsComponentProps> = ({
  chore,
  onCompleteHandler,
  onEditHandler,
  onDeleteHandler,
}) => {
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

  const optionsHandler = useCallback(() => {
    setIsOptionsOpen((cur: boolean) => !cur);
  }, []);

  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);
  const todaysDateStr = todaysDate.toISOString().split("T")[0];
  const dueDate = new Date(chore.due_on ?? "");
  dueDate.setHours(0, 0, 0, 0);

  return (
    <div className="card chore">
      <button
        className={`complete ${
          chore.completed_on === todaysDateStr ? "bg-green-900" : "bg-lime-600"
        }`}
        disabled={chore.completed_on === todaysDateStr}
        onClick={() => onCompleteHandler(chore)}
      >
        {chore.completed_on === todaysDateStr ? "DONE!" : "Complete"}
      </button>
      <button
        ref={setPopoverRef}
        data-popover-target="popover-chore-options"
        className="options"
        onClick={optionsHandler}
      >
        ...
      </button>
      {isOptionsOpen && (
        <ul
          className="options-popover"
          ref={setPopoverContentRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <li>
            <button
              className="edit bg-cyan-900 mb-2 w-full"
              onClick={() => onEditHandler(chore)}
              ref={setPopoverEditRef}
              style={styles.arrow}
            >
              Edit
            </button>
          </li>
          <li>
            <button
              className="delete bg-red-600 w-full"
              onClick={() => onDeleteHandler(chore.id)}
              ref={setPopoverDeleteRef}
              style={styles.arrow}
            >
              Delete
            </button>
          </li>
        </ul>
      )}
      <h2>Name: {chore.name}</h2>
      <h2
        className={`${
          dueDate.getTime() <= todaysDate.getTime() ? "bg-red-900" : ""
        }`}
      >
        Due On: {chore.due_on}
      </h2>
      <p>Frequency: {chore.frequency_days} days</p>
      <p>Last Completed: {chore.completed_on}</p>
      <p>Description: {chore.description}</p>
      {/* <p>Tags:</p> */}
      {/* <ul>{c.tags && c.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> */}
    </div>
  );
};

export default ChoreWithOptionsComponent;
