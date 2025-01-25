import { AsyncStatus } from "../enums/asyncStatus";

export interface ChoreStatus {
  fetchUserChores: AsyncStatus;
  fetchPublicChores: AsyncStatus;
  createChore: AsyncStatus;
  updateChore: AsyncStatus;
  deleteChore: AsyncStatus;
}
