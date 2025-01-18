import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router";
import LoginPage from "./components/LoginPage.component";
import MyChoresPage from "./components/MyChoresPage.component";
import EditChoresPage from "./components/EditChoresPage.component";
import NavigationBar from "./components/NavigationBar.component";
import { User } from "./models";

function App() {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate])

  const login = (user: User) => {
    setUser(user);
    navigate('/');
  }

  const logout = () => {
    setUser(undefined);
  };

  return (
    <>
      { user && <NavigationBar logout={logout} /> }
      <Routes>
        <Route path="/" element={<MyChoresPage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={login} />} />
        {/* <Route path="/chores" element={} /> */}
        <Route path="/create-chore" element={<EditChoresPage />} />
        {<Route path="/edit-chore" element={<EditChoresPage chore={{
          id: 3,
          name: 'MY EDIT CHORE WOW',
          description: 'My edit chore description here',
          frequencyDays: 6,
          completedOn: new Date(),
          tags: ['lawn care', 'mowing', 'something else']
        }}/>} />}
      </Routes>
    </>
  );
}

export default App;
