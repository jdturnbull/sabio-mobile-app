import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    profile: null,
  },
  reducers: {
    updateState: (state, action) => {
      state = { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setup.fulfilled, (state, action) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.loading = false;
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      if (action.payload) {
        state.session = action.payload.session;
        state.user = action.payload.user;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateState } = onboardingSlice.actions;

export default onboardingSlice.reducer;
