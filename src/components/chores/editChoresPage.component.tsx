import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChore,
  resetStatus,
  selectChoreError,
  selectChoreStatus,
  selectUserChores,
  updateChore,
} from "../../slices/choreSlice";
import { AsyncStatus } from "../../enums/asyncStatus";
import { useNavigate, useParams } from "react-router";
import FormComponent from "../shared/form.component";
import { FormInput, FormSubmit } from "../../models";
import { selectUserSession } from "../../slices";

const EditChoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);
  const chores = useSelector(selectUserChores);
  const status = useSelector(selectChoreStatus);
  const error = useSelector(selectChoreError);
  const navigate = useNavigate();
  const { id } = useParams();
  const chore = chores.find((c) => c.id === id);

  useEffect(() => {
    if (
      (!chore && status.createChore === AsyncStatus.SUCCESSFUL) ||
      (chore && status.updateChore === AsyncStatus.SUCCESSFUL)
    ) {
      dispatch(resetStatus());
      navigate("/");
    }
  }, [status, navigate, dispatch, chore]);

  const onSubmitHandler: SubmitHandler<FormSubmit> = (data: FormSubmit) => {
    dispatch(resetStatus());
    if (chore) {
      dispatch(
        updateChore({
          chore: {
            id: chore.id,
            name: data.name.toString(),
            description: data.description.toString(),
            completed_on: data.completedOn.toString(),
            frequency_days: +data.frequencyDays,
            public: !data.isPrivate,
          },
          accessToken: session.access_token,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );
    } else {
      dispatch(
        createChore({
          chore: {
            id: 'done-on-backend',
            name: data.name.toString(),
            description: data.description.toString(),
            completed_on: data.completedOn.toString(),
            frequency_days: +data.frequencyDays,
            public: !data.isPrivate,
          },
          accessToken: session.access_token,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );
    }
  };

  return (
    <>
      <h1 className="mb-6 text-cyan-500">
        {!chore ? "Create" : "Edit"} a Chore
      </h1>
      <FormComponent
        submitText={!chore ? "Create" : "Update"}
        onSubmitHandler={onSubmitHandler}
        error={error}
        loading={
          chore
            ? status.updateChore === AsyncStatus.LOADING
            : status.createChore === AsyncStatus.LOADING
        }
        inputs={[
          {
            id: "name",
            type: "text",
            label: "Name*",
            defaultValue: chore ? chore.name : "",
            required: true,
          } as FormInput,
          {
            id: "frequencyDays",
            type: "number",
            label: "Frequency (days)*",
            defaultValue: chore ? chore.frequency_days : "",
            required: true,
            additionalProps: {
              min: 1,
              maxLength: 10,
            },
          } as FormInput,
          {
            id: "completedOn",
            type: "date",
            label: "Last Completed",
            defaultValue: chore
              ? chore.completed_on
              : new Date().toISOString().split("T")[0],
          } as FormInput,
          {
            id: "isPrivate",
            type: "checkbox",
            label: "Private",
            defaultValue: chore ? !chore.public : 1,
          } as FormInput,
          {
            id: "description",
            type: "textarea",
            label: "Description",
            defaultValue: chore ? chore.description : "",
          } as FormInput,
        ]}
      />
    </>
  );
};

export default EditChoresPage;
