import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import call from '../../utils/call';

const initial_state = {
  profile: null,
  race: null,
  customGoal: null,
  runDistance: null,
  loseWeight: null,
  trainTriathlon: null,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: initial_state,
  reducers: {
    updateState: (state, action) => {
      state = { ...state, ...action.payload };
    },
    clearState: (state, action) => {
      state = initial_state;
    },
  },
  extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { updateState, clearState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
