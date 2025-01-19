import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "../utils/supabase";
import { Chore } from "../models";

export interface BrowseChoresPageProps {
  user?: User;
}

const BrowseChoresPage: React.FC<BrowseChoresPageProps> = ({ user }) => {
  const [chores, setChores] = useState<Chore[]>([]);

  const fetchChores = useCallback(async () => {
    const { data, error } = await supabase.from("chore").select().neq("user_id", user?.id);

    if (!error) {
      setChores(data as Chore[]);
    } else {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchChores();
  }, [fetchChores]);

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
