import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "../utils/supabase";
import { Chore } from "../models";

export interface MyChoresPageProps {
  user?: User;
}

const MyChoresPage: React.FC<MyChoresPageProps> = ({ user }) => {
  const [chores, setChores] = useState<Chore[]>([]);

  const fetchChores = async () => {
    const { data, error } = await supabase.from("chore").select();

    setChores(data);
  };

  useEffect(() => {
    fetchChores();
  }, []);

  const deleteHandler = async (id: string) => {
    try {
      await supabase.from("chore").delete().eq('id', id);
      await fetchChores();
    } catch (error) {
      console.error("Error deleting chore:", id, error);
    }
  }

  return (
    <>
      <h1>{user ? `${user.email} - ` : ""}Choredos</h1>
      <button onClick={() => {}}>Create Dummy Chore</button>
      {user &&
        chores &&
        chores.map((c, index) => (
          <div className="card" key={index}>
            <button onClick={() => deleteHandler(c.id)}>X</button>
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

export default MyChoresPage;
