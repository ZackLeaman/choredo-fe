import { SubmitHandler, useForm } from "react-hook-form";
import { Chore } from "../models/Chore";
import { useEffect } from "react";

export interface EditChoresPageProps {
  chore?: Chore;
}

interface IEditChoreInput {
  name: string;
  description: string;
  frequencyDays: number;
  tags: string;
  completedOn?: string;
}

const todaysDate = new Date();
todaysDate.setHours(0, 0, 0, 0);

const defaultFormValue = {
  name: "",
  description: "",
  frequencyDays: 1,
  tags: "",
  completedOn: todaysDate.toISOString().split("T")[0],
};

const EditChoresPage: React.FC<EditChoresPageProps> = ({ chore }) => {
  if (chore) {
    chore.completedOn.setHours(0, 0, 0, 0);
  }

  const { register, handleSubmit, reset } = useForm<IEditChoreInput>({
    defaultValues: chore
      ? {
          name: chore.name,
          description: chore.description,
          completedOn: chore.completedOn.toISOString().split("T")[0],
          frequencyDays: chore.frequencyDays,
          tags: chore.tags.join(", "),
        }
      : { ...defaultFormValue },
  });

  useEffect(() => {
    // Reset the form state with the new initialData when it changes
    reset(
      chore
        ? {
            name: chore.name,
            description: chore.description,
            completedOn: chore.completedOn.toISOString().split("T")[0],
            frequencyDays: chore.frequencyDays,
            tags: chore.tags.join(", "),
          }
        : { ...defaultFormValue }
    );
  }, [reset, chore]);

  const onSubmitHandler: SubmitHandler<IEditChoreInput> = (data) => {
    // e?.preventDefault();
    console.log("HEYO", data);
  };

  return (
    <>
      <h1 className="mb-8 text-cyan-500">
        {!chore ? "Create" : "Edit"} a Chore
      </h1>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-nowrap gap-2 justify-between">
          <label htmlFor="name">Name*</label>
          <input
            id="name"
            {...register("name", { required: true, maxLength: 20 })}
            type="text"
            className="text-right p-2"
          />
        </div>
        <div className="flex flex-nowrap gap-2 justify-between">
          <label htmlFor="frequencyDays">Frequency (days)*</label>
          <input
            id="frequencyDays"
            {...register("frequencyDays", {
              required: true,
              maxLength: 10,
              min: 1,
            })}
            type="number"
            min={1}
            className="text-right p-2"
          />
        </div>
        <div className="flex flex-nowrap gap-2 justify-between">
          <label htmlFor="completedOn">Last Completed</label>
          <input
            id="completedOn"
            {...register("completedOn")}
            type="date"
            className="text-right p-2"
          />
        </div>
        <div className="flex flex-col flex-nowrap gap-2">
          <label htmlFor="description" className="self-start">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="p-2"
          />
        </div>
        <div className="flex flex-col flex-nowrap gap-2">
          <label htmlFor="tags" className="self-start">
            Tags (comma separated)
          </label>
          <textarea id="tags" {...register("tags")} className="p-2" />
        </div>
        <button type="submit" className="bg-lime-600 mt-4">
          Submit
        </button>
      </form>
    </>
  );
};

export default EditChoresPage;
