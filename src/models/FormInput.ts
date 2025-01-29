export interface FormInput {
  id: string;
  type: string;
  label: string;
  defaultValue: string | number;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalProps?: any;
  disabled?: boolean;
}
