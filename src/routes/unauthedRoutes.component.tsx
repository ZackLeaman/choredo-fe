import { Route, Routes } from "react-router";
import UpdatePasswordPage from "@/components/auth/updatePasswordPage.component";
import LoginSignupPage from "@/components/auth/loginSignupPage.component";
import ForgotPasswordPage from "@/components/auth/forgotPasswordPage.component";

const UnauthedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<LoginSignupPage isSignup={true} />} />
      <Route path="/:email" element={<UpdatePasswordPage />} />
      <Route path="*" element={<LoginSignupPage />} />
    </Routes>
  );
};

export default UnauthedRoutes;
