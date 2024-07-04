import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async () => {
  const session = await AsyncStorage.getItem('session');

  if (session) {
    const { id } = JSON.parse(session);
    try {
      const updatedSession = await call('POST', `users/session`, { id });

      if (updatedSession) {
        await AsyncStorage.setItem('session', JSON.stringify(updatedSession));
        return { session: updatedSession };
      } else {
        await AsyncStorage.removeItem('session');
      }
    } catch (error) {
      return { session: null };
    }
  } else {
    return { session: null };
  }

  return { session: null };
});

export const continueWithApple = createAsyncThunk('user/continueWithApple', async (data) => {
  try {
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const { email, fullName, identityToken } = appleAuthResponse;

    if (identityToken) {
      const name = `${fullName.givenName || ''} ${fullName.familyName || ''}`;
      const timezone = RNLocalize.getTimeZone();

      const session = await call('POST', 'users/auth', {
        identityToken,
        timezone,
        email,
        name,
        onboardingData: data,
      });

      await AsyncStorage.setItem('session', JSON.stringify(session));

      return session;
    } else {
      // Error with Apple Signin
    }
  } catch (error) {
    console.log(error.message);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    error: null,
    loaded: false,
    allowChatBeforePayment: false,
    loading: false,
    onboarded: false,
    plannedActivities: [],
    plannedMonths: [],
    actions: [],
    signedIn: false,
    onboarded: false,
    session: null,
  },
  reducers: {
    updateState: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setup.fulfilled, (state, action) => {
      state.loaded = true;
      state.session = action.payload.session;
      state.signedIn = !!action.payload.session;
      state.allowChatBeforePayment = action.payload.session?.allowChatBeforePayment || false;
      state.onboarded = action.payload.session?.user?.onboarded;
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      if (action.payload) {
        state.session = action.payload;
        state.signedIn = true;
        state.allowChatBeforePayment = action.payload.allowChatBeforePayment;
        state.loaded = true;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedDate, updateState, signout } = userSlice.actions;

export default userSlice.reducer;
