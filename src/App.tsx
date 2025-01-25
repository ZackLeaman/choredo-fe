import "./App.css";
import { useSelector } from "react-redux";
import { selectUser } from "./slices";
import AuthedRoutes from "./routes/authedRoutes.component";
import UnauthedRoutes from "./routes/unauthedRoutes.component";

function App() {
  const user = useSelector(selectUser);

  if (user && user.aud === 'authenticated' && user.id) {
    return <AuthedRoutes />
  }
  
  return <UnauthedRoutes />;
}

export default App;
