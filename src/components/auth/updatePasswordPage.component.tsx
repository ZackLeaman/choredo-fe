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

const UpdatePasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);
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

  const onSubmitHandler: SubmitHandler<FormSubmit> = (data: FormSubmit) => {
    if (accessToken && data.password && data.confirm && refreshToken) {
      dispatch(
        fetchUpdatePassword({
          data: { ...data, accessToken, refreshToken },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );
    }
  };

  return (
    <div>
      <h1>Choredos - Update Password</h1>
      <FormComponent
        submitText="Update"
        onSubmitHandler={onSubmitHandler}
        error={error}
        loading={status === AsyncStatus.LOADING}
        inputs={[
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
    </div>
  );
};

export default UpdatePasswordPage;
