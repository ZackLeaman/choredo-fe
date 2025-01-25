import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAppSlice } from "../store/createAppSlice";
import { AsyncStatus } from "../enums/asyncStatus";
import { Chore, ChoreStateData, ChoreStatus } from "../models";
import { User } from "@supabase/supabase-js";
// import { v4 as uuidv4 } from "uuid";
import MockChores from "../data/chores";

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
  },
  error: "",
};

export const fetchUserChores = createAsyncThunk<Chore[], { user: User }>(
  "chore/fetchUserChores",
  async ({ user }, { rejectWithValue }) => {
    try {
      // const { data, error } = await supabase
      //   .from("chore")
      //   .select()
      //   .eq("user_id", user.id);

      // if (error) {
      //   throw new Error(error.message);
      // }

      return MockChores.filter((c) => !c.public);
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
      // const { data, error } = await supabase
      //   .from("chore")
      //   .select()
      //   .neq("user_id", user.id);

      // if (error) {
      //   throw new Error(error.message);
      // }

      return MockChores.filter((c) => c.public);
    } catch (error: unknown) {
      console.error("Error fetching public chores", error);
      return rejectWithValue(error);
    }
  }
);

export const updateChore = createAsyncThunk<void, { chore: Partial<Chore> }>(
  "chore/updateChore",
  async ({ chore }, { rejectWithValue }) => {
    // try {
    //   const { error } = await supabase
    //     .from("chore")
    //     .update({
    //       name: chore.name,
    //       description: chore.description,
    //       completed_on: chore.completed_on,
    //       frequency_days: chore.frequency_days,
    //       public: chore.public,
    //     })
    //     .eq("id", chore.id);

    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // } catch (error: unknown) {
    //   console.error("Error updating chore", error);
    //   return rejectWithValue(error);
    // }
    console.log("update chore called", chore);
  }
);

export const deleteChore = createAsyncThunk<void, { id: string }>(
  "chore/deleteChore",
  async ({ id }, { rejectWithValue }) => {
    // try {
    //   const { error } = await supabase.from("chore").delete().eq("id", id);

    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // } catch (error: unknown) {
    //   console.error("Error delete chore", error);
    //   return rejectWithValue(error);
    // }
    console.log("delete chore called", id);
  }
);

export const createChore = createAsyncThunk<void, { chore: Chore }>(
  "chore/createChore",
  async ({ chore }, { rejectWithValue }) => {
    // try {
    //   const { error } = await supabase.from("chore").insert({
    //     id: uuidv4(),
    //     name: chore.name,
    //     description: chore.description,
    //     completed_on: chore.completed_on,
    //     frequency_days: chore.frequency_days,
    //     public: chore.public,
    //   });

    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // } catch (error: unknown) {
    //   console.error("Error create chore", error);
    //   return rejectWithValue(error);
    // }
    console.log("create chore called", chore);
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
