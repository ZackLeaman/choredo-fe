import { NavLink } from "react-router";
import FormComponent from "../shared/form.component";
import { FormInput, FormSubmit } from "../../models";
import { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForgotPassword,
  resetError,
  selectUserError,
  selectUserStatus,
} from "../../slices";
import { AsyncStatus } from "../../enums/asyncStatus";
import { useEffect } from "react";

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);

useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(resetError() as any)
}, [dispatch]);

  const onSubmitHandler: SubmitHandler<FormSubmit> = (data: FormSubmit) => {
    if (data.email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchForgotPassword({ data }) as any);
    }
  };

  return (
    <div className="mt-20">
      <div className="flex flex-col gap-2 items-center justify-centerd">
        <img className="icon" src="/creature-icon.jpg" />
        <h1 className="text-left">Choredos - Forgot Password</h1>
      </div>
      <section className="flex justify-center">
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
      </section>
      <NavLink to="/">to Login</NavLink>
    </div>
  );
};

export default ForgotPasswordPage;
