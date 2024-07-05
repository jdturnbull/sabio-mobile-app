import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    profile: null,
    race: null,
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
