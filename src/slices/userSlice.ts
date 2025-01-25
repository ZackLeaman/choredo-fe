import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FormSubmit } from "../models";
import { AsyncStatus } from "../enums/asyncStatus";
import { createAppSlice } from "../store/createAppSlice";
import { User } from "@supabase/supabase-js";

export interface UserSliceState {
  data: User;
  status: AsyncStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

const initialState: UserSliceState = {
  data: {
    id: "",
    aud: "",
    role: "",
    email: "",
    app_metadata: {
      provider: "",
      providers: [],
    },
    identities: [],
    user_metadata: {},
    created_at: "",
  },
  status: AsyncStatus.NONE,
  error: "",
};

export const fetchLogin = createAsyncThunk<User | null, { data: FormSubmit }>(
  "user/fetchLogin",
  async ({ data }, { rejectWithValue }) => {
    if (data.email && data.password) {
      try {
        const res = await fetch(`http://localhost:3000/auth/login`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        });
        if (res) {
          const resParse = await res.json();

          if (resParse.error) {
            throw new Error(resParse.error);
          }

          // TODO use resParse.data.session as well

          console.log("HEYO", resParse.data.user);
          return resParse.data.user;
        }
        throw new Error("no user login response");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error login user", error);
        return rejectWithValue(error.toString());
      }
    }
    return rejectWithValue("Error login: invalid params");
  }
);

export const fetchSignup = createAsyncThunk<User | null, { data: FormSubmit }>(
  "user/fetchSignup",
  async ({ data }, { rejectWithValue }) => {
    if (data.email && data.password) {
      try {
        const res = await fetch(`http://localhost:3000/auth/signup`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (res) {
          const resParse = await res.json();

          if (resParse.error) {
            throw new Error(resParse.error);
          }

          return resParse;
        }
        throw new Error("no user signup response");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error signup user", error);
        return rejectWithValue(error);
      }
    }
    return rejectWithValue("Error signup: invalid params");
  }
);

export const fetchForgotPassword = createAsyncThunk<
  string | null,
  { data: FormSubmit }
>("user/fetchForgotPassword", async ({ data }, { rejectWithValue }) => {
  if (data.email) {
    try {
      const res = await fetch(`http://localhost:3000/auth/forgot-password`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res) {
        const resParse = await res.json();

        if (resParse.error) {
          throw new Error(resParse.error);
        }

        return resParse.message;
      }
      throw new Error("no forgot password response");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error forgot password", error);
      return rejectWithValue(error);
    }
  }
  return rejectWithValue("Error forgot password: invalid params");
});

export const fetchUpdatePassword = createAsyncThunk<
  string | null,
  { data: FormSubmit }
>("user/fetchUpdatePassword", async ({ data }, { rejectWithValue }) => {
  if (data.password && data.confirm && data.accessToken && data.refreshToken) {
    try {
      const res = await fetch(`http://localhost:3000/auth/update-password`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res) {
        const resParse = await res.json();

        if (resParse.error) {
          throw new Error(resParse.error);
        }

        return resParse.data.user;
      }
      throw new Error("no update password response");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error update password", error);
      return rejectWithValue(error);
    }
  }
  return rejectWithValue("Error update password: invalid params");
});

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraReducers: (builder: any) => {
    builder
      .addCase(
        fetchLogin.fulfilled,
        (state: UserSliceState, action: PayloadAction<User>) => {
          state.data = action.payload;
          state.error = "";
          state.status = AsyncStatus.SUCCESSFUL;
        }
      )
      .addCase(fetchLogin.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        state.data = { ...initialState.data };
      })
      .addCase(
        fetchLogin.rejected,
        (state: UserSliceState, action: PayloadAction<string>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload.toString();
        }
      )
      .addCase(
        fetchSignup.fulfilled,
        (state: UserSliceState, action: PayloadAction<User>) => {
          console.log(action.payload);
          state.data = action.payload;
          state.error = "";
          state.status = AsyncStatus.SUCCESSFUL;
        }
      )
      .addCase(fetchSignup.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        state.data = { ...initialState.data };
      })
      .addCase(
        fetchSignup.rejected,
        (state: UserSliceState, action: PayloadAction<string>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload.toString();
        }
      )
      .addCase(fetchForgotPassword.fulfilled, (state: UserSliceState) => {
        state.data = { ...initialState.data };
        state.error = "";
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchForgotPassword.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        state.data = { ...initialState.data };
      })
      .addCase(
        fetchForgotPassword.rejected,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: UserSliceState, action: PayloadAction<any>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload;
        }
      )
      .addCase(fetchUpdatePassword.fulfilled, (state: UserSliceState) => {
        state.data = { ...initialState.data };
        state.error = "";
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchUpdatePassword.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        state.data = { ...initialState.data };
      })
      .addCase(
        fetchUpdatePassword.rejected,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: UserSliceState, action: PayloadAction<any>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload;
        }
      );
  },
  selectors: {
    selectUser: (user: UserSliceState) => user.data,
    selectUserStatus: (user: UserSliceState) => user.status,
    selectUserError: (user: UserSliceState) => user.error,
  },
});

export const { selectUser, selectUserStatus, selectUserError } =
  userSlice.selectors;
