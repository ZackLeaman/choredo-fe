import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { FormInput, FormSubmit } from "@/models";
import FormComponent from "@/components/shared/form.component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpdatePassword,
  resetError,
  selectUserError,
  selectUserStatus,
} from "@/slices";
import { AsyncStatus } from "@/enums/asyncStatus";
import { useNavigate, useParams } from "react-router";

const UpdatePasswordPage: React.FC = () => {
  const parms = useParams();
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);
  const navigate = useNavigate();
  const { email, access_token, refresh_token } = useParams();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(resetError() as any);
      
    if (!email || !access_token || !refresh_token) {
      navigate('/');
    }
  }, [dispatch]);

  const onSubmitHandler: SubmitHandler<FormSubmit> = async (
    data: FormSubmit
  ) => {
    if (access_token && data.password && data.confirm && refresh_token) {
      const resultAction = await dispatch(
        fetchUpdatePassword({
          data: { ...data, accessToken: access_token, refreshToken: refresh_token },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );

      if (fetchUpdatePassword.fulfilled.match(resultAction)) {
        // If the action was successful, redirect to '/'
        navigate("/");
      }
    }
  };

  return (
    <div className="mt-20">
      <div className="flex flex-col gap-2 items-center justify-center">
        <img className="icon" src="/choredo-fe/creature-icon.jpg" />
        <h1 className="text-left">Choredos - Update Password</h1>
      </div>
      <section className="flex justify-center">
        <FormComponent
          submitText="Update"
          onSubmitHandler={onSubmitHandler}
          error={error}
          loading={status === AsyncStatus.LOADING}
          inputs={[
            {
              id: "email",
              type: "email",
              label: "Email",
              defaultValue: parms.email,
              disabled: true,
            } as FormInput,
            {
              id: "password",
              type: "password",
              label: "Password",
              defaultValue: "",
              required: true,
            } as FormInput,
            {
              id: "confirm",
              type: "password",
              label: "Confirm Password",
              defaultValue: "",
              required: true,
            } as FormInput,
          ]}
        />
      </section>
    </div>
  );
};

export default UpdatePasswordPage;
