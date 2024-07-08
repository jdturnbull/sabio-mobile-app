import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// race, customGoal, runDistance, loseWeight, trainTriathlon, generalFitness

const initial_state = {
  profile: null,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: initial_state,
  reducers: {
    updateState: (state, action) => {
      Object.assign(state, action.payload);
    },
    clearState: (state, action) => {
      return initial_state;
    },
  },
  extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { updateState, clearState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
