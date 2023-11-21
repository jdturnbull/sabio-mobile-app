import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    assistant: null,
    activeToolId: null,
    thread: null,
    activity: null,
    messages: [],
    runId: null,
  },
  reducers: {
    updateState: (state, action) => {
      state = Object.assign(state, { ...action.payload });
    },
  },
});

export const { updateState } = chatSlice.actions;

export default chatSlice.reducer;
