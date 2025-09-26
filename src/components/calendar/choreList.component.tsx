import { useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd/dist/dnd";
import "./choreList.component.css";

enum ItemStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  COMPLETE = "complete",
}

interface Card {
  id: string;
  content: string;
  status: ItemStatus;
  prevCard: string | null;
  nextCard: string | null;
}

const ChoreList: React.FC = () => {
  const [statusColumns, setStatusColumns] = useState([
    { id: ItemStatus.TODO, title: "TODO" },
    { id: ItemStatus.IN_PROGRESS, title: "IN PROGRESS" },
    { id: ItemStatus.COMPLETE, title: "DONE" },
  ]);
  const [cards, setCards] = useState<{ [key: string]: Card }>({
    "card-1": {
      id: "card-1",
      content: "Card 1",
      status: ItemStatus.TODO,
      prevCard: null,
      nextCard: null,
    },
    "card-2": {
      id: "card-2",
      content: "Card 2",
      status: ItemStatus.IN_PROGRESS,
      prevCard: null,
      nextCard: null,
    },
    "card-3": {
      id: "card-3",
      content: "Card 3",
      status: ItemStatus.COMPLETE,
      prevCard: null,
      nextCard: "card-4",
    },
    "card-4": {
      id: "card-4",
      content: "Card 4",
      status: ItemStatus.COMPLETE,
      prevCard: "card-3",
      nextCard: "card-5",
    },
    "card-5": {
      id: "card-5",
      content: "Card 5",
      status: ItemStatus.COMPLETE,
      prevCard: "card-4",
      nextCard: null,
    },
  });
  const [isDragging, setIsDragging] = useState(false);

  const onDragStartHandler = () => {
    setIsDragging(true);
  };

  const onDragEndHandler = (result: DropResult) => {
    console.log(result);
    setIsDragging(false);
    const { draggableId, destination } = result;
    if (draggableId && destination && destination.droppableId) {
      setCards((prevState) => {
        const card = cards[draggableId];
        if (!card) return prevState;

        const { droppableId, index } = destination;
        const prevCard = cards[card.prevCard || ""];
        const nextCard = cards[card.nextCard || ""];

        if (prevCard) {
          prevCard.nextCard = card.nextCard;
        }
        if (nextCard) {
          nextCard.prevCard = card.prevCard;
        }

        const newStatusFirstCard = Object.values(cards).find(
          (c) => c.status === droppableId && c.prevCard === null && c.id !== card.id
        );

        if (newStatusFirstCard) {
          if (index === 0) {
            card.prevCard = null;
            card.nextCard = newStatusFirstCard.id;
            newStatusFirstCard.prevCard = card.id;
          } else {
            let counter = 0;
            let currentCard: Card | null = newStatusFirstCard;
            let nextCard: Card | null = currentCard.nextCard ? cards[currentCard.nextCard] : null;
            while (currentCard) {
              if ((counter === index - 1 || !nextCard) && card.id !== currentCard.id) {
                card.prevCard = currentCard.id;
                card.nextCard = nextCard ? nextCard.id : null;
                currentCard.nextCard = card.id;
                if (nextCard) {
                  nextCard.prevCard = card.id;
                }
                break;
              }

              currentCard = nextCard;
              nextCard = currentCard?.nextCard ? cards[currentCard.nextCard] : null;
              counter++;
            }
          }
        } else {
          card.nextCard = null;
          card.prevCard = null;
        }

        card.status = destination.droppableId as ItemStatus;

        return {
          ...prevState,
          [draggableId]: card,
        };
      });
    }
  };

  const getCardLinkedList = (status: ItemStatus) => {
    const firstCard = Object.values(cards).find(
      (card) => card.status === status && card.prevCard === null
    );

    if (!firstCard) return null;

    const cardList = [firstCard];
    let currentCard = firstCard;
    do {
      if (currentCard?.nextCard) {
        const nextCard = cards[currentCard.nextCard];
        cardList.push(nextCard);
        currentCard = nextCard;
      } else {
        break;
      }
    } while (currentCard?.nextCard);

    return cardList.map((card, index) => (
      <Draggable key={card.id} draggableId={card.id} index={index}>
        {(provided) => (
          <div
            className="card"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {card.content}
          </div>
        )}
      </Draggable>
    ));
  };

  return (
    <section className="chore-list">
      <DragDropContext onDragEnd={onDragEndHandler} onDragStart={onDragStartHandler}>
        <table>
          <tbody>
            <tr>
              {statusColumns.map((column) => (
                <th key={column.id}>{column.title}</th>
              ))}
            </tr>
            <tr>
              {statusColumns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <td
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: "50px" }}
                      className={`content-columns ${isDragging ? "dragging" : ""}`}
                    >
                      {getCardLinkedList(column.id)}
                      {provided.placeholder}
                    </td>
                  )}
                </Droppable>
              ))}
            </tr>
          </tbody>
        </table>
      </DragDropContext>
    </section>
  );
};

export default ChoreList;
