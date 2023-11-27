import { createSlice } from '@reduxjs/toolkit';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    onboarded: false,
    assistant: null,
    activeToolId: null,
    thread: null,
    messages: [],
    runId: null,
  },
  reducers: {
    updateState: (state, action) => {
      state = Object.assign(state, { ...action.payload });
    },
  },
});

export const { updateState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
