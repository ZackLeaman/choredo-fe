import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAppSlice } from "@/store/createAppSlice";
import { AsyncStatus } from "@/enums/asyncStatus";
import { Chore, ChoreStateData, ChoreStatus } from "@/models";

export interface ChoresSliceState {
  data: ChoreStateData;
  status: ChoreStatus;
  error: string;
}

const initialState: ChoresSliceState = {
  data: {
    userChores: [],
    publicChores: [],
  },
  status: {
    fetchUserChores: AsyncStatus.NONE,
    fetchPublicChores: AsyncStatus.NONE,
    createChore: AsyncStatus.NONE,
    updateChore: AsyncStatus.NONE,
    deleteChore: AsyncStatus.NONE,
    completeChore: AsyncStatus.NONE,
  },
  error: "",
};

export const fetchUserChores = createAsyncThunk<
  Chore[],
  { accessToken: string }
>("chore/fetchUserChores", async ({ accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/chores`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    if (!res) {
      throw new Error("fetch failed");
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
});

export const fetchPublicChores = createAsyncThunk<
  Chore[],
  { accessToken: string }
>("chore/fetchPublicChores", async ({ accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/chores/public`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    if (!res) {
      throw new Error("fetch failed");
    }

    const { data, error } = await res.json();

    if (error) {
      throw new Error(error);
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    console.error("Error fetching public chores", error);
    return rejectWithValue(error);
  }
});

export const updateChore = createAsyncThunk<
  void,
  { chore: Chore; accessToken: string }
>("chore/updateChore", async ({ chore, accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/chores/${chore.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "PUT",
        body: JSON.stringify(chore),
      }
    );

    if (!res) {
      throw new Error("fetch failed");
    }

    const { data, error } = await res.json();

    if (error) {
      throw new Error(error);
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    console.error("Error updating chore", error);
    return rejectWithValue(error);
  }
});

export const deleteChore = createAsyncThunk<
  void,
  { choreId: string; accessToken: string }
>(
  "chore/deleteChore",
  async ({ choreId, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/chores/${choreId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "DELETE",
        }
      );

      if (!res) {
        throw new Error("fetch failed");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.error("Error deleting chore", error);
      return rejectWithValue(error);
    }
  }
);

export const createChore = createAsyncThunk<
  void,
  { chore: Chore; accessToken: string }
>("chore/createChore", async ({ chore, accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/chores`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(chore),
    });

    if (!res) {
      throw new Error("fetch failed");
    }

    const { data, error } = await res.json();

    if (error) {
      throw new Error(error);
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    console.error("Error creating chore", error);
    return rejectWithValue(error);
  }
});

export const completeChore = createAsyncThunk<
  void,
  { choreId: string; accessToken: string }
>(
  "chore/completeChore",
  async ({ choreId, accessToken }, { rejectWithValue }) => {
    try {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/chores/complete/${choreId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            completed_on: todayDate.toISOString().split("T")[0],
          }),
        }
      );

      if (!res) {
        throw new Error("fetch failed");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.error("Error completing chore", error);
      return rejectWithValue(error);
    }
  }
);

export const choreSlice = createAppSlice({
  name: "chore",
  initialState,
  reducers: (create) => ({
    resetStatus: create.reducer((state) => {
      state.status = { ...initialState.status };
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChores.fulfilled, (state, action) => {
        state.data.userChores = action.payload;
        state.status.fetchUserChores = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchUserChores.pending, (state) => {
        state.status.fetchUserChores = AsyncStatus.LOADING;
      })
      .addCase(fetchUserChores.rejected, (state) => {
        state.status.fetchUserChores = AsyncStatus.REJECTED;
      })
      .addCase(fetchPublicChores.fulfilled, (state, action) => {
        state.data.publicChores = action.payload;
        state.status.fetchPublicChores = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchPublicChores.pending, (state) => {
        state.status.fetchPublicChores = AsyncStatus.LOADING;
      })
      .addCase(fetchPublicChores.rejected, (state) => {
        state.status.fetchPublicChores = AsyncStatus.REJECTED;
      })
      .addCase(updateChore.fulfilled, (state) => {
        state.status.updateChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(updateChore.pending, (state) => {
        state.status.updateChore = AsyncStatus.LOADING;
      })
      .addCase(updateChore.rejected, (state) => {
        state.status.updateChore = AsyncStatus.REJECTED;
      })
      .addCase(createChore.fulfilled, (state) => {
        state.status.createChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(createChore.pending, (state) => {
        state.status.createChore = AsyncStatus.LOADING;
      })
      .addCase(createChore.rejected, (state) => {
        state.status.createChore = AsyncStatus.REJECTED;
      })
      .addCase(completeChore.fulfilled, (state) => {
        state.status.completeChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(completeChore.pending, (state) => {
        state.status.completeChore = AsyncStatus.LOADING;
      })
      .addCase(completeChore.rejected, (state) => {
        state.status.completeChore = AsyncStatus.REJECTED;
      })
      .addCase(deleteChore.fulfilled, (state) => {
        state.status.deleteChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(deleteChore.pending, (state) => {
        state.status.deleteChore = AsyncStatus.LOADING;
      })
      .addCase(deleteChore.rejected, (state) => {
        state.status.deleteChore = AsyncStatus.REJECTED;
      });
  },
  selectors: {
    selectUserChores: (chores) => chores.data.userChores,
    selectPublicChores: (chores) => chores.data.publicChores,
    selectChoreError: (chores) => chores.error,
    selectChoreStatus: (chores) => chores.status,
  },
});

export const { resetStatus } = choreSlice.actions;
export const {
  selectUserChores,
  selectPublicChores,
  selectChoreError,
  selectChoreStatus,
} = choreSlice.selectors;
