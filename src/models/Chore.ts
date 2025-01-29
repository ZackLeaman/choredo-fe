export interface Chore {
  id: string;
  name: string;
  description: string;
  completed_on: string;
  frequency_days: number;
  public: boolean;
  username?: string;
}
