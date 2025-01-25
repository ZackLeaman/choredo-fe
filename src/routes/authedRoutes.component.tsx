import { Route, Routes } from "react-router";
import NavigationBar from "../components/shared/navigationBar.component";
import MyChoresPage from "../components/chores/myChoresPage.component";
import BrowseChoresPage from "../components/chores/browseChoresPage.component";
import EditChoresPage from "../components/chores/editChoresPage.component";

const AuthedRoutes: React.FC = () => {
  return (
    <>
      {/* TODO add a signout fetch */}
      <NavigationBar logout={() => {}} />
      <Routes>
        <Route path="/" element={<MyChoresPage />} />
        <Route path="/chores" element={<BrowseChoresPage />} />
        <Route path="/create-chore" element={<EditChoresPage />} />
        <Route path="/edit-chore/:id" element={<EditChoresPage />} />
        <Route path="*" element={<div>404 Not Found.</div>} />
      </Routes>
    </>
  );
};

export default AuthedRoutes;
