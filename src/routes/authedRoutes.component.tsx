import { Route, Routes, useNavigate } from "react-router";
import NavigationBar from "../components/shared/navigationBar.component";
import MyChoresPage from "../components/chores/myChoresPage.component";
import BrowseChoresPage from "../components/chores/browseChoresPage.component";
import EditChoresPage from "../components/chores/editChoresPage.component";
import { useDispatch, useSelector } from "react-redux";
import { fetchSignoutUser, selectUserSession, selectUserStatus } from "../slices";
import { AsyncStatus } from "../enums/asyncStatus";
import AchievementsPage from "../components/achievements/achievements.component";

const AuthedRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserStatus);
  const session = useSelector(selectUserSession);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signoutAction = await dispatch(fetchSignoutUser(session.access_token) as any);

    if (fetchSignoutUser.fulfilled.match(signoutAction)) {
      // If the action was successful, redirect to '/'
      navigate('/');
    }
  }

  return (
    <>
      <NavigationBar logout={logoutHandler} loading={loading === AsyncStatus.LOADING} />
      <Routes>
        <Route path="/" element={<MyChoresPage />} />
        <Route path="/chores" element={<BrowseChoresPage />} />
        <Route path="/create-chore" element={<EditChoresPage />} />
        <Route path="/edit-chore/:id" element={<EditChoresPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="*" element={<div>404 Not Found.</div>} />
      </Routes>
    </>
  );
};

export default AuthedRoutes;
