import "./App.css";
import { useSelector } from "react-redux";
import { selectUser } from "@/slices";
import AuthedRoutes from "@/routes/authedRoutes.component";
import UnauthedRoutes from "@/routes/unauthedRoutes.component";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  const user = useSelector(selectUser);

  return <header>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>

  if (user && user.aud === 'authenticated' && user.id) {
    return <AuthedRoutes />
  }
  
  return <UnauthedRoutes />;
}

export default App;
