import {
  ChangeEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DateData } from "@/models/DateData";
import "./calendarPage.component.css";
import moment from "moment";

const CalendarPage: React.FC = () => {
  const [cellContent, setCellContent] = useState([] as { id: number, year: number, month: number, day: number }[]);
  const [rowSelectors, setRowSelectors] = useState([] as number[]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDates, setSelectedDates] = useState([] as number[]);
  const [rowSelectorsSelected, setRowSelectorsSelected] = useState([] as boolean[]);
  const [dateData, setDateData] = useState({ monthText: '', monthValue: 0, date: '', yearText: '', isCurrentYear: false })
  const [todayCellId, setTodayCellId] = useState(-1);
  const daysShown = 7;
  const weeksShown = 6;
  const cellHeader = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  useEffect(() => {
    // TODO except a prop to determine which starting focus date
    const date = moment().format('YYYY-MM-DD');
    setDateData({
      monthText: moment().format('MMMM'),
      monthValue: +moment().format('MM'),
      date,
      yearText: date.split('-')[0],
      isCurrentYear: true
    });

    const handleMouseUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const focusedDate = moment(dateData.date);
    const startMonth = focusedDate.startOf('month');
    const startMonthDay = +startMonth.format('d');
    const dayOffset = startMonthDay === 0 ? 7 : startMonthDay;
    let dateCycler = startMonth.subtract(dayOffset, 'days');
    const newCellContent = [];
    const newRowSelectors = [];
    let todayCellId = -1;
    for (let w = 0; w < weeksShown; w++) {
      for (let d = 0; d < daysShown; d++) {
        const id = d + daysShown * w;
        if (todayCellId === -1 && dateCycler.isSame(new Date(), "day")) {
          todayCellId = id;
        }
        newCellContent.push({ id, year: +dateCycler.format('YYYY'), month: +dateCycler.format('MM'), day: +dateCycler.format('DD') });
        dateCycler = dateCycler.add(1, 'days');
      }
      newRowSelectors.push(w);
    }
    setCellContent(newCellContent);
    setRowSelectors(newRowSelectors);
    setRowSelectorsSelected(newRowSelectors.map(() => false));
    setTodayCellId(todayCellId);
  }, [dateData])

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

  const handleMonthCycle = (offset: number) => {
    const newDate = moment(dateData.date).add(offset, 'months').format('YYYY-MM-DD');
    setDateData({
      monthText: moment(newDate).format('MMMM'),
      monthValue: +moment(newDate).format('MM'),
      date: newDate,
      yearText: newDate.split('-')[0],
      isCurrentYear: newDate.split('-')[0] === moment().format('YYYY')
    })
  }

  return (
    <section className="main">
      <div className="calendar-grid">
        <div className="calendar-title">
          <button onClick={() => handleMonthCycle(-1)}>{`<`}</button>
          <h1>{`${dateData.monthText}${!dateData.isCurrentYear ? ' ' + dateData.yearText : ''}`}</h1>
          <button onClick={() => handleMonthCycle(1)}>{`>`}</button>
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
              key={cell.id}
              className={`calendar-cell content ${
                selectedDates.includes(index) ? "highlight" : ""
              } ${cellContent.length - 1 === index ? "bottom-right" : ""} ${
                cellContent.length - daysShown === index ? "bottom-left" : ""
              } ${todayCellId === index ? "current-day" : ""} ${dateData.monthValue !== cell.month ? 'faded' : ''}`}
              onMouseDown={() => handleMouseDown(cell.id)}
              onMouseMove={() => handleMouseMove(cell.id)}
            >
              <div className="calendar-day-numeric">{cell.day}</div>
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
