import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput, FormSubmit } from "../../models";
import { useEffect } from "react";

interface FormComponentProps {
  onSubmitHandler: SubmitHandler<FormSubmit>;
  inputs: FormInput[];
  submitText: string;
  error?: string;
  loading?: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
  onSubmitHandler,
  submitText,
  inputs,
  error,
  loading,
}) => {
  const { register, handleSubmit, formState, reset } = useForm<{
    [key: string]: string | number;
  }>(inputs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: cur.defaultValue,
    }),
    {}
  ));

  useEffect(() => {
    reset(inputs.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cur.defaultValue,
      }),
      {}
    ));
  }, [inputs, reset]);

  return (
    <section className="mt-10">
      {error && (
        <span
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          {error}
        </span>
      )}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-2 card"
      >
        {inputs &&
          inputs.map((input, index) => (
            <section
              key={`${input.id}-${index}`}
              className="flex flex-nowrap gap-2 justify-between items-center min-w-md object-contain"
            >
              <label htmlFor={input.id}>{input.label}</label>
              {input.type !== "textarea" && (
                <input
                  id={input.id}
                  type={input.type}
                  disabled={input.disabled ?? loading}
                  className="p-2"
                  {...register(`${input.id}`, {
                    required: input.required,
                    ...input.additionalProps,
                  })}
                  {...input.additionalProps}
                />
              )}
              {input.type === "textarea" && (
                <textarea
                  id={input.id}
                  disabled={input.disabled ?? loading}
                  {...register(input.id, {
                    required: input.required,
                    ...input.additionalProps,
                  })}
                  {...input.additionalProps}
                  className="p-2"
                />
              )}
            </section>
          ))}
        {loading && <div>Loading...</div>}
        {!loading && (
          <button
            type="submit"
            disabled={!formState.isValid || loading}
            className={`${!formState.isValid || loading ? 'bg-gray-800' : 'bg-lime-600'} mt-4`}
          >
            {submitText}
          </button>
        )}
      </form>
    </section>
  );
};

export default FormComponent;
