import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosinstance from "../Connection/Api";

// Action to submit profile
export const submitProfile = createAsyncThunk(
  "profile/submitProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPublicProfiles = createAsyncThunk(
  "profile/fetchPublicProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get("/profile");
      console.log(response.data)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  'profile/fetchProfileById',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/profiledetail/${profileId}`);
      console.log(response.data)
      return response.data
    } catch (error) {
      // Return just the error message string
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch profile'
      );
    }
  }
);
// Profile Slice with state management
const profileSlice = createSlice({
  name: "profile",
  initialState: {
 loading: false,
  error: null,
  success: false,
  profile: null,
   currentProfile: null,
  publicProfiles: [], // Initialize as empty array
  publicProfilesLoading: false,
  publicProfilesError: null
  },
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.profile = null;
    },
    setFormData: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.profile;
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchPublicProfiles.pending, (state) => {
        state.publicProfilesLoading = true;
        state.publicProfilesError = null;
      })
      .addCase(fetchPublicProfiles.fulfilled, (state, action) => {
        state.publicProfilesLoading = false;
        state.publicProfiles = action.payload.profiles;
      })
      .addCase(fetchPublicProfiles.rejected, (state, action) => {
        state.publicProfilesLoading = false;
        state.publicProfilesError = action.payload;
      })
            .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { resetProfileState, setFormData } = profileSlice.actions;
export default profileSlice.reducer;
