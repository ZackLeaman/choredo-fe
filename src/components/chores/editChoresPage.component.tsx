import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChore,
  resetStatus,
  selectChoreError,
  selectChoreStatus,
  selectPublicChores,
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
  const publicChores = useSelector(selectPublicChores);
  const status = useSelector(selectChoreStatus);
  const error = useSelector(selectChoreError);
  const navigate = useNavigate();
  const { id } = useParams();
  let copyingChore = false;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // set editable chore either from user or public chores
  let chore = chores.find((c) => c.id === id);
  if (!chore) {
    chore = publicChores.find((c) => c.id === id);
    if (chore) {
      copyingChore = true;
      // will want to clear certain data to copy a new chore
      chore = {
        ...chore,
        id: 'blah', // be handles id creation
        completed_on: todayDate.toISOString().split("T")[0],
        public: false
      }
    }
  }

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
    if (chore && !copyingChore) {
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
      <h1 className="mb-6 mt-14">
        {!chore ? "Create" : "Edit"} a Chore
      </h1>
      <section className="flex justify-center">
        <FormComponent
          submitText={!chore || copyingChore ? "Create" : "Update"}
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
                : todayDate.toISOString().split("T")[0],
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
      </section>
    </>
  );
};

export default EditChoresPage;
