import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupUserTest, selectUser } from "@/slices";
import AuthedRoutes from "@/routes/authedRoutes.component";
import UnauthedRoutes from "@/routes/unauthedRoutes.component";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const fetchTest = async () => {
    const token = await getToken();
    dispatch(fetchGroupUserTest(token ?? '') as any);
  }

  return <header>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
      <button onClick={fetchTest}>Fetch Users Test</button>
    </SignedIn>
  </header>

  if (user && user.aud === 'authenticated' && user.id) {
    return <AuthedRoutes />
  }
  
  return <UnauthedRoutes />;
}

export default App;
