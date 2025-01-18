import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../createAppSlice";
import { AsyncStatus } from "../enums/AsyncStatus";
import { User } from "../models";

export interface UserSliceState {
  data: User;
  status: AsyncStatus;
}

const initialState: UserSliceState = {
  data: {
    id: 0,
    username: "",
    email: "",
  },
  status: AsyncStatus.NONE,
};

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    fetchUser: create.reducer((state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.status = AsyncStatus.SUCCESSFUL;
    }),
    //   incrementAsync: create.asyncThunk(
    //     async (amount: number) => {
    //       const response = await fetchCount(amount)
    //       // The value we return becomes the `fulfilled` action payload
    //       return response.data
    //     },
    //     {
    //       pending: state => {
    //         state.status = "loading"
    //       },
    //       fulfilled: (state, action) => {
    //         state.status = "idle"
    //         state.value += action.payload
    //       },
    //       rejected: state => {
    //         state.status = "failed"
    //       },
    //     },
    //   ),
  }),
  selectors: {
    selectUser: (user) => user.data,
    selectStatus: (user) => user.status,
  },
});

export const { fetchUser } = userSlice.actions;
export const { selectUser, selectStatus } = userSlice.selectors;
