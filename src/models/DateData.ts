import { Chore } from "./Chore";

export interface DateData {
  day: number;
  month: number;
  year: number;
  chores: Chore[];
}
