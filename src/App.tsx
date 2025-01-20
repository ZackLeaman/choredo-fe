import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import LoginPage from "./components/LoginPage.component";
import MyChoresPage from "./components/MyChoresPage.component";
import EditChoresPage from "./components/EditChoresPage.component";
import NavigationBar from "./components/NavigationBar.component";
import { Session } from "@supabase/supabase-js";
import supabase from "./utils/supabase";
import BrowseChoresPage from "./components/BrowseChoresPage.component";
import { useSelector } from "react-redux";
import { selectEditChore } from "./slices/choreSlice";

function App() {
  const editChore = useSelector(selectEditChore);
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

  if (user) {
    return (
      <>
        <NavigationBar logout={signOut} />
        <Routes>
          <Route path="/" element={<MyChoresPage user={user} />} />
          <Route path="/chores" element={<BrowseChoresPage user={user} />} />
          <Route path="/create-chore" element={<EditChoresPage />} />
          {
            editChore && <Route path="/edit-chore" element={<EditChoresPage />} />
          }
          <Route path="*" element={<div>404 Not Found.</div>} />
        </Routes>
      </>
    );
  }

  return (
    <Routes>
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
