export const USER_PROGRESS_MAX = 7; // currently relates to frequency_days on chore completed

export const updateUserProgress = (
  level: number,
  progress: number,
  offset: number
) => {
  const totalProgress = progress + offset;
  const levelOffset = Math.floor(totalProgress / USER_PROGRESS_MAX);
  const newProgress = totalProgress - levelOffset * USER_PROGRESS_MAX;
  const newLevel = level + levelOffset;

  return { level: newLevel, progress: newProgress };
};
