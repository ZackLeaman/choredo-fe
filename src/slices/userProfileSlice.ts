import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../store/createAppSlice";
import { AsyncStatus } from "../enums/asyncStatus";
import { UserProfileData } from "../models";

export interface UserProfileSliceState {
  data: UserProfileData;
  status: AsyncStatus;
  error: string;
}

const initialState: UserProfileSliceState = {
  data: {
    level: 0,
    progress: 0,
    chores_completed: 0,
    level_up_increase: 0,
    achievements: [],
  },
  status: AsyncStatus.NONE,
  error: "",
};

export const fetchGetUserProfile = createAsyncThunk<
  UserProfileData,
  { accessToken: string }
>(
  "userProfile/fetchGetUserProfile",
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/user-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      });

      if (!res) {
        throw new Error("fetch get user profile failed");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.error("Error fetching user chores", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchPostUserProfile = createAsyncThunk<
  UserProfileData,
  {
    accessToken: string;
    level?: number;
    progress?: number;
    chores_completed?: number;
    level_up_increase?: number;
  }
>(
  "userProfile/fetchPostUserProfile",
  async (
    { accessToken, level, progress, chores_completed, level_up_increase },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("http://localhost:3000/user-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          level: level !== undefined ? level : 0,
          progress: progress !== undefined ? progress : 0,
          chores_completed:
            chores_completed !== undefined ? chores_completed : 0,
          level_up_increase:
            level_up_increase !== undefined ? level_up_increase : 0,
        }),
      });

      if (!res) {
        throw new Error("fetch post user profile failed");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.error("Error fetching user chores", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchUserAchievements = createAsyncThunk<
  {
    id: number;
    location: string;
  }[],
  {
    accessToken: string;
  }
>(
  "userProfile/fetchUserAchievements",
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/achievement", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      });

      if (!res) {
        throw new Error("fetch user achievements failed");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.error("Error fetching user achievements", error);
      return rejectWithValue(error);
    }
  }
);

export const userProfileSlice = createAppSlice({
  name: "userProfile",
  initialState,
  reducers: (create) => ({
    addAchievement: create.reducer(
      (state, action: PayloadAction<{ id: number; location: string }>) => {
        state.data.achievements = [action.payload, ...state.data.achievements];
      }
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetUserProfile.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchGetUserProfile.pending, (state) => {
        state.status = AsyncStatus.LOADING;
      })
      .addCase(fetchGetUserProfile.rejected, (state) => {
        state.status = AsyncStatus.REJECTED;
      })
      .addCase(fetchPostUserProfile.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchPostUserProfile.pending, (state) => {
        state.status = AsyncStatus.LOADING;
      })
      .addCase(fetchPostUserProfile.rejected, (state) => {
        state.status = AsyncStatus.REJECTED;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.data = { ...state.data, achievements: action.payload };
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchUserAchievements.pending, (state) => {
        state.status = AsyncStatus.LOADING;
      })
      .addCase(fetchUserAchievements.rejected, (state) => {
        state.status = AsyncStatus.REJECTED;
      });
  },
  selectors: {
    selectUserProfile: (userProfile) => userProfile.data,
    selectUserProfileLevel: (userProfile) => userProfile.data.level,
    selectUserProfileProgress: (userProfile) => userProfile.data.progress,
    selectUserProfileError: (userProfile) => userProfile.error,
    selectUserProfileStatus: (userProfile) => userProfile.status,
  },
});

export const { addAchievement } = userProfileSlice.actions;
export const {
  selectUserProfile,
  selectUserProfileError,
  selectUserProfileStatus,
  selectUserProfileLevel,
  selectUserProfileProgress,
} = userProfileSlice.selectors;
