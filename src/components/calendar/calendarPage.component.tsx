import {
  ChangeEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DateData } from "@/models/DateData";
import "./calendarPage.component.css";

const CalendarPage: React.FC = () => {
  const [cellContent, setCellContent] = useState([] as { value: number }[]);
  const [rowSelectors, setRowSelectors] = useState([] as number[]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDates, setSelectedDates] = useState([] as number[]);
  const [rowSelectorsSelected, setRowSelectorsSelected] = useState([] as boolean[]);
  const currentDay = 11;
  const daysShown = 7;
  const weeksShown = 6;
  const cellHeader = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const newCellContent = [];
    const newRowSelectors = [];
    for (let w = 0; w < weeksShown; w++) {
      for (let d = 0; d < daysShown; d++) {
        newCellContent.push({ value: d + daysShown * w });
      }
      newRowSelectors.push(w);
    }
    setCellContent(newCellContent);
    setRowSelectors(newRowSelectors);
    setRowSelectorsSelected(newRowSelectors.map(() => false));

    const handleMouseUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (buttonId: number) => {
    setSelectedDates([buttonId]);
    setIsDragging(true);
    setRowSelectorsSelected(prevSelectors => prevSelectors.map(() => false));
  };

  const handleMouseMove = (buttonId: number) => {
    if (isDragging && !selectedDates.includes(buttonId)) {
      setSelectedDates((prevValue: number[]) => [...prevValue, buttonId]);
    }
  };

  const handleColumnClick = (index: number) => {
    const newSelectedDates = [...selectedDates];
    for (let week = 0; week < weeksShown; week++) {
      const dateId = index + week * daysShown;
      if (!newSelectedDates.includes(dateId)) {
        newSelectedDates.push(dateId);
      }
    }
    if (selectedDates.length !== newSelectedDates.length) {
      setSelectedDates(newSelectedDates);
    }
  };

  const handleRowClick = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    let newSelectedDates = [] as number[];
    const newDates = [] as number[];
    const indexToDayId = index * daysShown;
    for (let d = 0; d < daysShown; d++) {
      const dateId = indexToDayId + d;
      newDates.push(dateId);
    }

    if (isChecked) {
      newSelectedDates = [...selectedDates];
      newDates.forEach((dateId) => {
        if (!newSelectedDates.includes(dateId)) {
          newSelectedDates.push(dateId);
        }
      });
    } else {
      selectedDates.forEach((dateId) => {
        if (!newDates.includes(dateId)) {
          newSelectedDates.push(dateId);
        }
      });
    }

    setRowSelectorsSelected(prevSelectors => {
        const newSelectors = [...prevSelectors];
        newSelectors[index] = isChecked;
        return newSelectors;
    });

    if (selectedDates.length !== newSelectedDates.length) {
      setSelectedDates(newSelectedDates);
    }
  };

  return (
    <section className="main">
      <div className="calendar-grid">
        <div className="calendar-title">
          <button>{`<`}</button>
          <h1>August</h1>
          <button>{`>`}</button>
        </div>
        {cellHeader &&
          cellHeader.map((cell, index) => (
            <button
              className="calendar-cell header"
              key={cell}
              onClick={() => handleColumnClick(index)}
            >
              {cell}
            </button>
          ))}
        {cellContent &&
          cellContent.map((cell, index) => (
            <button
              key={cell.value}
              className={`calendar-cell content ${
                selectedDates.includes(index) ? "highlight" : ""
              } ${cellContent.length - 1 === index ? "bottom-right" : ""} ${
                cellContent.length - daysShown === index ? "bottom-left" : ""
              } ${currentDay === index ? "current-day" : ""}`}
              onMouseDown={() => handleMouseDown(cell.value)}
              onMouseMove={() => handleMouseMove(cell.value)}
            >
              <div className="calendar-day-numeric">{cell.value}</div>
              <div className="calendar-day-events">
                <div className="calendar-day-event high-priority">
                  Event 1111111111111111111111111111111
                </div>
                <div className="calendar-day-event medium-priority">
                  Event 2
                </div>
                <div className="calendar-day-event low-priority">Event 3</div>
              </div>
            </button>
          ))}
        {rowSelectors && (
          <div className="calendar-row-selector-grid">
            {rowSelectors.map((row, index) => (
              <Fragment key={`calendar-row-selector-${row}`}>
                <label htmlFor={`calendar-row-selector-${row}`} hidden>
                  Toggle Week {row + 1} Selection
                </label>
                <input
                  id={`calendar-row-selector-${row}`}
                  className="calendar-row-selector"
                  type="checkbox"
                  onChange={(e) => handleRowClick(row, e)}
                  checked={rowSelectorsSelected[index]}
                ></input>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CalendarPage;
