export interface UserProfileData {
  level: number;
  progress: number;
  chores_completed: number;
  level_up_increase: number;
  achievements: {
    id: number;
    location: string;
  }[];
}
