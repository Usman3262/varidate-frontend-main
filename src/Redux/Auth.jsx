import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosinstance from "../Connection/Api";
import { toast } from "react-toastify";

export const signupuserform = createAsyncThunk(
  "signupuser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post("/post", user);
      toast.success(response.data.message);
      return null; // No user object returned from backend
    } catch (error) {
      const errMsg = error.response?.data?.message || "Signup failed";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const loginuserform = createAsyncThunk(
  "loginuser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post("/login", user);
      
      // Check if user is verified before allowing login
      if (response.data.user?.verified !== true) {
        throw new Error("Email not verified");
      }
      
      toast.success(response.data.message);
      return response.data;
      
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);


export const verifyEmailToken = createAsyncThunk(
  "verifyEmail",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post("/verify-code", { email, code });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Verification failed";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  'auth/resendVerificationCode',
  async ({ email }, { rejectWithValue }) => { // Destructure the email from an object
    try {
      const res = await axiosinstance.post('/resend-code', { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to resend code");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosinstance.post("/forgot-password", { email });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, code, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosinstance.post("/reset-password", { email, code, newPassword });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const authslice = createSlice({
  name: "auth",
  initialState: {
       user: null,
    error: null,
    token: null,
    message: null,
    authenticated: false,
    loading: false,
    emailVerified: false,
    verificationLoading: false,
    verificationError: null
  },
  reducers: {
    logouts: (state) => {
      state.user = null;
      state.token = null;
      state.authenticated = false;
      state.emailVerified = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupuserform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupuserform.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupuserform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginuserform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginuserform.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.emailVerified = true; // Since login only succeeds if verified
        state.error = null;
      })
      .addCase(loginuserform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authenticated = false;
      })

      // Email Verification
      .addCase(verifyEmailToken.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyEmailToken.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.emailVerified = true;
        state.user = action.payload.user; // Update user data if returned
        state.verificationError = null;
      })
      .addCase(verifyEmailToken.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload;
      })
        .addCase(resendVerificationCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(resendVerificationCode.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    })
    .addCase(resendVerificationCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
export default authslice.reducer;
export const { logouts } = authslice.actions;