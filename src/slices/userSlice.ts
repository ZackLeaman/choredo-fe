import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";
import { FormSubmit } from "@/models";
import { AsyncStatus } from "@/enums/asyncStatus";
import { createAppSlice } from "@/store/createAppSlice";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  emails: string[];
  imageUrl: string;
}
interface UserGroup {
  group_id: string;
  user_id: string;
  group_name: string;
  role: string;
  status: string;
}
export interface UserSliceState {
  data: {
    user: User;
    userGroups: { userInfo: UserInfo[]; userGroups: UserGroup[] };
    session: Session;
  };
  status: AsyncStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

const initialState: UserSliceState = {
  data: {
    user: {
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
    userGroups: { userInfo: [], userGroups: [] },
    session: {
      access_token: "",
      refresh_token: "",
      expires_in: 0,
      token_type: "",
      user: {
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
    },
  },
  status: AsyncStatus.NONE,
  error: "",
};

export const fetchLogin = createAsyncThunk<User | null, { data: FormSubmit }>(
  "user/fetchLogin",
  async ({ data }, { rejectWithValue }) => {
    if (data.email && data.password) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/auth/login`, {
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

          console.log("HEYO", resParse.data);
          return resParse.data;
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
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/auth/signup`, {
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/auth/forgot-password`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/auth/update-password`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (res) {
        const resParse = await res.json();

        if (resParse.error) {
          throw new Error(resParse.error);
        }

        return resParse.message;
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

export const fetchSignoutUser = createAsyncThunk<string, string>(
  "user/fetchSignoutUser",
  async (accessToken, { rejectWithValue }) => {
    if (accessToken) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}/auth/signout`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
          }
        );
        if (res) {
          const resParse = await res.json();

          if (resParse.error) {
            throw new Error(resParse.error);
          }

          return resParse.message;
        }
        throw new Error("no signout user response");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error signout user", error);
        return rejectWithValue(error);
      }
    }
    return rejectWithValue("Error update password: invalid params");
  }
);

export const fetchGroupUserTest = createAsyncThunk<string, string>(
  "protected",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/protected`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });
      if (res) {
        const resParse = await res.json();

        if (resParse.error) {
          throw new Error(resParse.error);
        }

        // TODO use resParse.data.session as well

        console.log("HEYO", resParse.data);
        return resParse.data;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetch group users", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const fetchUserGroups = createAsyncThunk<string, { token: string }>(
  "group",
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });
      if (res) {
        const resParse = await res.json();
        return resParse.data;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetch group users", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const fetchSendGroupInvite = createAsyncThunk<
  string,
  { token: string; groupId: string; email: string }
>("group/invite", async ({ token, groupId, email }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/group/invite`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ groupId, email }),
      method: "POST",
    });
    if (res) {
      const resParse = await res.json();

      if (resParse.error) {
        throw new Error(resParse.error);
      }

      // TODO use resParse.data.session as well

      console.log("HEYO", resParse.data);
      return resParse.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetch group users", error);
    return rejectWithValue(error.toString());
  }
});

export const fetchCreateGroup = createAsyncThunk<
  string,
  { token: string; name: string }
>("group", async ({ token, name }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/group`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
      method: "POST",
    });
    if (res) {
      const resParse = await res.json();

      if (resParse.error) {
        throw new Error(resParse.error);
      }

      // TODO use resParse.data.session as well

      console.log("HEYO", resParse.data);
      return resParse.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetch create group", error);
    return rejectWithValue(error.toString());
  }
});

export const fetchJoinGroup = createAsyncThunk<
  string,
  { token: string; groupId: string }
>("group/join", async ({ token, groupId }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/group/join`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ groupId }),
      method: "POST",
    });
    if (res) {
      const resParse = await res.json();

      if (resParse.error) {
        throw new Error(resParse.error);
      }

      // TODO use resParse.data.session as well

      console.log("HEYO", resParse.data);
      return resParse.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error joining group", error);
    return rejectWithValue(error.toString());
  }
});

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    resetError: create.reducer((state) => {
      state.error = "";
    }),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraReducers: (builder: any) => {
    builder
      .addCase(
        fetchLogin.fulfilled,
        (
          state: UserSliceState,
          action: PayloadAction<{ user: User; session: Session }>
        ) => {
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
        fetchUserGroups.fulfilled,
        (
          state: UserSliceState,
          action: PayloadAction<{
            userInfo: UserInfo[];
            userGroups: UserGroup[];
          }>
        ) => {
          state.data.userGroups = action.payload;
          state.error = "";
          state.status = AsyncStatus.SUCCESSFUL;
        }
      )
      .addCase(fetchUserGroups.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        // state.data = { ...initialState.data };
      })
      .addCase(
        fetchUserGroups.rejected,
        (state: UserSliceState, action: PayloadAction<string>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload.toString();
        }
      )
      .addCase(
        fetchSignup.fulfilled,
        (state: UserSliceState, action: PayloadAction<User>) => {
          console.log(action.payload);
          // TODO fix signup
          // state.data = action.payload;
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
      )
      .addCase(fetchSignoutUser.fulfilled, (state: UserSliceState) => {
        state.data = { ...initialState.data };
        state.error = "";
        state.status = AsyncStatus.SUCCESSFUL;
      })
      .addCase(fetchSignoutUser.pending, (state: UserSliceState) => {
        state.status = AsyncStatus.LOADING;
        state.data = { ...initialState.data };
      })
      .addCase(
        fetchSignoutUser.rejected,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: UserSliceState, action: PayloadAction<any>) => {
          state.status = AsyncStatus.REJECTED;
          state.error = action.payload;
        }
      );
  },
  selectors: {
    selectUser: (user: UserSliceState) => user.data.user,
    selectUserGroups: (user: UserSliceState) => user.data.userGroups,
    selectUserSession: (user: UserSliceState) => user.data.session,
    selectUserStatus: (user: UserSliceState) => user.status,
    selectUserError: (user: UserSliceState) => user.error,
  },
});

export const { resetError } = userSlice.actions;
export const {
  selectUser,
  selectUserGroups,
  selectUserSession,
  selectUserStatus,
  selectUserError,
} = userSlice.selectors;
