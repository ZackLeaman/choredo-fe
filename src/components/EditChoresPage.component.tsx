import { SubmitHandler, useForm } from "react-hook-form";
import { Chore } from "../models/Chore";
import { useEffect } from "react";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from 'uuid';

export interface EditChoresPageProps {
  chore?: Chore;
}

interface IEditChoreInput {
  name: string;
  description: string;
  frequencyDays: number;
  isPrivate: boolean;
  completedOn?: string;
  // tags: string;
}

const todaysDate = new Date();
todaysDate.setHours(0, 0, 0, 0);

const defaultFormValue = {
  name: "",
  description: "",
  frequency_days: 1,
  completed_on: todaysDate.toISOString().split("T")[0],
  isPrivate: true,
  // tags: "",
};

const EditChoresPage: React.FC<EditChoresPageProps> = ({ chore }) => {
  const { register, handleSubmit, reset } = useForm<IEditChoreInput>({
    defaultValues: chore
      ? {
          name: chore.name,
          description: chore.description,
          completedOn: chore.completed_on,
          frequencyDays: chore.frequency_days,
          isPrivate: chore.public ? !chore.public : true,
          // tags: chore.tags.join(", "),
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
            completedOn: chore.completed_on,
            frequencyDays: chore.frequency_days,
            isPrivate: chore.public ? !chore.public : true,
            // tags: chore.tags.join(", "),
          }
        : { ...defaultFormValue }
    );
  }, [reset, chore]);

  const onSubmitHandler: SubmitHandler<IEditChoreInput> = (data) => {
    console.log("SUBMIT PRESSED")
    if (chore) {
      supabase.from('chore').update({
        name: data.name,
        description: data.description,
        completed_on: data.completedOn,
        frequency_days: data.frequencyDays,
        public: !data.isPrivate,
      }).eq('id', chore.id).then((data, error) => {
        if (error) {
          throw new Error(error);
        }
        console.log("UPDATE DATA", data);
      }).catch((e) => console.log(e));
    } else {
      supabase.from('chore').insert({
        id: uuidv4(),
        name: data.name,
        description: data.description,
        completed_on: data.completedOn,
        frequency_days: data.frequencyDays,
        public: !data.isPrivate,
      }).then((data, error) => {
        if (error) {
          throw new Error(error);
        }
        console.log("INSERT DATA", data);
      }).catch((e) => console.log(e));
    }
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
        <div className="flex flex-nowrap gap-2 justify-between">
          <label htmlFor="isPrivate">Private</label>
          <input
            id="isPrivate"
            {...register("isPrivate")}
            type="checkbox"
            className="p-2"
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
        {/* <div className="flex flex-col flex-nowrap gap-2">
          <label htmlFor="tags" className="self-start">
            Tags (comma separated)
          </label>
          <textarea id="tags" {...register("tags")} className="p-2" />
        </div> */}
        <button type="submit" className="bg-lime-600 mt-4">
          Submit
        </button>
      </form>
    </>
  );
};

export default EditChoresPage;
