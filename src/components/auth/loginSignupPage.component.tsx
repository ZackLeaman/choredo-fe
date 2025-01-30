import { SubmitHandler } from "react-hook-form";
import { FormInput, FormSubmit } from "../../models";
import { NavLink, useNavigate } from "react-router";
import FormComponent from "../shared/form.component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLogin,
  fetchSignup,
  selectUserError,
  selectUserStatus,
} from "../../slices";
import { AsyncStatus } from "../../enums/asyncStatus";

interface LoginSignupPageProps {
  isSignup?: boolean;
}

const LoginSignupPage: React.FC<LoginSignupPageProps> = ({ isSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);

  const onSubmitHandler: SubmitHandler<FormSubmit> = async (data: FormSubmit) => {
    if (data.email && data.password) {
      if (isSignup) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resultAction = await dispatch(fetchSignup({ data }) as any);

        if (fetchSignup.fulfilled.match(resultAction)) {
          // If the action was successful, redirect to '/'
          navigate('/');
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(fetchLogin({ data }) as any);
      }
    }
  };

  return (
    <div>
      <h1>Choredos - {isSignup ? "Signup" : "Login"}</h1>
      <section className="flex justify-center">
        <FormComponent
          submitText={isSignup ? "Signup" : "Login"}
          onSubmitHandler={onSubmitHandler}
          error={error}
          loading={status === AsyncStatus.LOADING}
          inputs={[
            {
              id: "email",
              type: "email",
              label: "Email",
              defaultValue: "",
              required: true,
            } as FormInput,
            {
              id: "password",
              type: "password",
              label: "Password",
              defaultValue: "",
              required: true,
            } as FormInput,
          ]}
        />
      </section>
      <div className="flex justify-around mt-10">
        <NavLink to={isSignup ? "/" : "/signup"}>
          to {isSignup ? "Login" : "Signup"}
        </NavLink>
        {!isSignup && <NavLink to={"/forgot-password"}>Forgot Password?</NavLink>}
      </div>
    </div>
  );
};

export default LoginSignupPage;
