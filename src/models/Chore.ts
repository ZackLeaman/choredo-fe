export interface Chore {
  id: number;
  name: string;
  description: string;
  completedOn: Date;
  frequencyDays: number;
  tags: string[];
}
