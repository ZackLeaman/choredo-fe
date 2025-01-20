import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../createAppSlice";
import { AsyncStatus } from "../enums/AsyncStatus";
import { Chore } from "../models";
import { User } from "@supabase/supabase-js";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";

export interface ChoresSliceState {
  data: {
    userChores: Chore[];
    publicChores: Chore[];
    editChore: Chore | null;
  };
  status: {
    fetchUserChores: AsyncStatus;
    fetchPublicChores: AsyncStatus;
    createChore: AsyncStatus;
    updateChore: AsyncStatus;
    deleteChore: AsyncStatus;
  };
  error: string | null;
}

const initialState: ChoresSliceState = {
  data: {
    userChores: [],
    publicChores: [],
    editChore: null,
  },
  status: {
    fetchUserChores: AsyncStatus.NONE,
    fetchPublicChores: AsyncStatus.NONE,
    createChore: AsyncStatus.NONE,
    updateChore: AsyncStatus.NONE,
    deleteChore: AsyncStatus.NONE,
  },
  error: null,
};

export const fetchUserChores = createAsyncThunk<Chore[], { user: User }>(
  "chore/fetchUserChores",
  async ({ user }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("chore")
        .select()
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      return data as Chore[];
    } catch (error: unknown) {
      console.error("Error fetching user chores", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchPublicChores = createAsyncThunk<Chore[], { user: User }>(
  "chore/fetchPublicChores",
  async ({ user }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("chore")
        .select()
        .neq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      return data as Chore[];
    } catch (error: unknown) {
      console.error("Error fetching public chores", error);
      return rejectWithValue(error);
    }
  }
);

export const updateChore = createAsyncThunk<void, { chore: Partial<Chore> }>(
  "chore/updateChore",
  async ({ chore }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("chore")
        .update({
          name: chore.name,
          description: chore.description,
          completed_on: chore.completed_on,
          frequency_days: chore.frequency_days,
          public: chore.public,
        })
        .eq("id", chore.id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: unknown) {
      console.error("Error updating chore", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteChore = createAsyncThunk<void, { id: string }>(
  "chore/deleteChore",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("chore").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: unknown) {
      console.error("Error delete chore", error);
      return rejectWithValue(error);
    }
  }
);

export const createChore = createAsyncThunk<void, { chore: Chore }>(
  "chore/createChore",
  async ({ chore }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("chore").insert({
        id: uuidv4(),
        name: chore.name,
        description: chore.description,
        completed_on: chore.completed_on,
        frequency_days: chore.frequency_days,
        public: chore.public,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: unknown) {
      console.error("Error create chore", error);
      return rejectWithValue(error);
    }
  }
);

export const choreSlice = createAppSlice({
  name: "chore",
  initialState,
  reducers: (create) => ({
    editChore: create.reducer((state, action: PayloadAction<Chore | null>) => {
      state.data.editChore = action.payload;
    }),
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
        state.data.editChore = null;
        state.status.updateChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(updateChore.pending, (state) => {
        state.status.updateChore = AsyncStatus.LOADING;
      })
      .addCase(updateChore.rejected, (state) => {
        state.status.updateChore = AsyncStatus.REJECTED;
      })
      .addCase(createChore.fulfilled, (state) => {
        state.data.editChore = null;
        state.status.createChore = AsyncStatus.SUCCESSFUL;
      })
      .addCase(createChore.pending, (state) => {
        state.status.createChore = AsyncStatus.LOADING;
      })
      .addCase(createChore.rejected, (state) => {
        state.status.createChore = AsyncStatus.REJECTED;
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
    selectEditChore: (chores) => chores.data.editChore,
    selectError: (chores) => chores.error,
    selectStatus: (chores) => chores.status,
  },
});

export const { editChore, resetStatus } = choreSlice.actions;
export const {
  selectUserChores,
  selectPublicChores,
  selectEditChore,
  selectError,
  selectStatus,
} = choreSlice.selectors;
