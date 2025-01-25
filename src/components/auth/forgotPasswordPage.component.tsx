import { NavLink } from "react-router";
import FormComponent from "../shared/form.component";
import { FormInput, FormSubmit } from "../../models";
import { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForgotPassword,
  selectUserError,
  selectUserStatus,
} from "../../slices";
import { AsyncStatus } from "../../enums/asyncStatus";

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);

  const onSubmitHandler: SubmitHandler<FormSubmit> = (data: FormSubmit) => {
    if (data.email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchForgotPassword({ data }) as any);
    }
  };

  return (
    <div>
      <h1>Choredos - Forgot Password</h1>
      <FormComponent
        submitText="Submit"
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
        ]}
      />
      <NavLink to="/">to Login</NavLink>
    </div>
  );
};

export default ForgotPasswordPage;
