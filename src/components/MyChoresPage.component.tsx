import { useCallback, useEffect, useState } from "react";
import { User } from "../models";
import { Chore } from "../models/Chore";

export interface MyChoresPageProps {
  user?: User;
}

const MyChoresPage: React.FC<MyChoresPageProps> = ({ user }) => {
  const [chores, setChores] = useState<
    {
      name: string;
      frequencyDays: number;
      description: string;
      completedOn: Date;
      tags: string[];
    }[]
  >([]);

  const getUserChores = useCallback(() => {
    fetch(`http://localhost:3000/chores/${user?.id}`, {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res) {
          return res.json();
        }
        throw new Error("Error fetching chores");
      })
      .then((res) => {
        console.log(res);
        setChores(
          res.data.map((c: Chore) => ({
            ...c,
            completedOn: new Date(c.completedOn),
          }))
        );
      })
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    if (user) {
      getUserChores();
    }
  }, [user, getUserChores]);

  const apiReq = () => {
    if (user) {
      fetch("http://localhost:3000/chores", {
        method: "POST",
        headers: {
          // Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: "my great first chore",
          frequencyDays: 7,
          description: "My default description chore here!",
          completedOn: Date.now(),
          tags: ["lawn care", "time consuming"],
        }),
      }).then(() => {
        getUserChores();
      });
    }
  };

  return (
    <>
      <h1>{user ? `${user?.username} - ` : ""}Choredos</h1>
      <button onClick={apiReq}>Create Dummy Chore</button>
      {user &&
        chores &&
        chores.map((c, index) => (
          <div className="card" key={index}>
            <h2>Name: {c.name}</h2>
            <p>Frequency: {c.frequencyDays} days</p>
            <p>Last Completed: {c.completedOn.toDateString()}</p>
            <p>Description: {c.description}</p>
            <p>Tags:</p>
            <ul>{c.tags && c.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </div>
        ))}
    </>
  );
};

export default MyChoresPage;
