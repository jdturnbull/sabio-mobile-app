import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import call from '../../utils/call';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    profile: null,
    race: null, // Won't neccesarily include unit or terrain
  },
  reducers: {
    updateState: (state, action) => {
      state = { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { updateState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
