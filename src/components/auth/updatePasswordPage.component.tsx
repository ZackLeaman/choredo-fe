import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormInput, FormSubmit } from "../../models";
import FormComponent from "../shared/form.component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpdatePassword,
  selectUserError,
  selectUserStatus,
} from "../../slices";
import { AsyncStatus } from "../../enums/asyncStatus";
import { useNavigate, useParams } from "react-router";

const UpdatePasswordPage: React.FC = () => {
  const parms = useParams();
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#' character

      // Extract access token and refresh token
      const aToken = params.get("access_token");
      const rToken = params.get("refresh_token");

      // Set the tokens in state
      if (aToken) {
        setAccessToken(aToken);
      }
      if (rToken) {
        setRefreshToken(rToken);
      }
    }
  }, []);

  const onSubmitHandler: SubmitHandler<FormSubmit> = async (
    data: FormSubmit
  ) => {
    if (accessToken && data.password && data.confirm && refreshToken) {
      const resultAction = await dispatch(
        fetchUpdatePassword({
          data: { ...data, accessToken, refreshToken },
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
    <div>
      <h1>Choredos - Update Password</h1>
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
