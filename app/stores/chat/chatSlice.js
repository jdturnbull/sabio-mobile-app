import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import call from '../../utils/call';

const initial_state = {
    assistant: null,
    thread: null,
    messages: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initial_state,
    reducers: {
        updateState: (state, action) => {
            Object.assign(state, action.payload);
        },
    },
    extraReducers: (builder) => {
    },
});

// Action creators are generated for each case reducer function
export const { updateState } = chatSlice.actions;

export default chatSlice.reducer;
