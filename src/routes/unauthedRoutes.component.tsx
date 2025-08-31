import { Route, Routes } from "react-router";
import UpdatePasswordPage from "@/components/auth/updatePasswordPage.component";
import LoginSignupPage from "@/components/auth/loginSignupPage.component";
import ForgotPasswordPage from "@/components/auth/forgotPasswordPage.component";
import CalendarPage from "@/components/calendar/CalendarPage.component";

const UnauthedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/update-password/:email/:access_token/:refresh_token" element={<UpdatePasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<LoginSignupPage isSignup={true} />} />
      <Route path="*" element={<LoginSignupPage />} />
      <Route path="/playground" element={<CalendarPage />} />
    </Routes>
  );
};

export default UnauthedRoutes;
