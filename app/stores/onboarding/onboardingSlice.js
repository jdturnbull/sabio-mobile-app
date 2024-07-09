import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import call from '../../utils/call';

// race, customGoal, runDistance, loseWeight, trainTriathlon, generalFitness, generalHealth

export const save = createAsyncThunk('onboarding/save', async (props) => {
  try {
    const response = await call('POST', 'users/saveOnboardingData', props);
  } catch (error) {
    console.log(error);
  }
});

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
  extraReducers: (builder) => {
    builder.addCase(save.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const { updateState, clearState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
