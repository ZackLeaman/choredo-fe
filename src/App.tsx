import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import LoginPage from "./components/LoginPage.component";
import MyChoresPage from "./components/MyChoresPage.component";
import EditChoresPage from "./components/EditChoresPage.component";
import NavigationBar from "./components/NavigationBar.component";
import { createClient, Session } from "@supabase/supabase-js";
import supabase from "./utils/supabase";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  const user = session?.user;
  console.log("HEYO SETTING USER", session, user);

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <>
      <NavigationBar logout={signOut} />
      <Routes>
        <Route path="/" element={<MyChoresPage user={user} />} />
        {/* <Route path="/chores" element={} /> */}
        <Route path="/create-chore" element={<EditChoresPage />} />
        {
          <Route
            path="/edit-chore"
            element={
              <EditChoresPage
                chore={{
                  id: uuidv4(),
                  name: "MY EDIT CHORE WOW",
                  description: "My edit chore description here",
                  frequency_days: 6,
                  completed_on: (new Date()).toISOString().split('T')[0],
                  // tags: ["lawn care", "mowing", "something else"],
                }}
              />
            }
          />
        }
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
