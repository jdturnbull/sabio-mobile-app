import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import { useDatabase } from '../../data/database';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async () => {
  try {
    const session = await AsyncStorage.getItem('session');

    if (session) {
      const { id } = JSON.parse(session);
      const valid = await call('GET', `users/session/${id}`);

      if (valid) {
        return { session: JSON.parse(session) };
      }

      await AsyncStorage.removeItem('session');
    }

    return { session: null };
  } catch (error) {}
});

export const continueWithApple = createAsyncThunk('user/continueWithApple', async () => {
  const name = 'James Turnbull';
  const email = 'jdturnbull98@gmail.com';
  const timezone = RNLocalize.getTimeZone();

  const session = await call('POST', 'users/auth', { identityToken: '123', timezone, email, name });
  await AsyncStorage.setItem('session', JSON.stringify(session));

  return session;

  // try {
  //   const appleAuthResponse = await appleAuth.performRequest({
  //     requestedOperation: appleAuth.Operation.LOGIN,
  //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //   });
  //   const { email, fullName, identityToken } = appleAuthResponse;
  //   if (identityToken) {
  //     const name = `${fullName.givenName || ''} ${fullName.familyName || ''}`;
  //     const timezone = RNLocalize.getTimeZone();
  //     const session = await call('POST', 'users/auth', { identityToken, timezone, email, name });
  //     const user = await call('GET', `users/${session.userId}`);
  //     await AsyncStorage.setItem('session', JSON.stringify(session));
  //   } else {
  //     // Error with apple signin
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
});

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    error: null,
    loaded: false,
    loading: false,
    signedIn: false,
    session: null,
    onboardingState: {
      motivations: [],
      goal: '',
      achieveBy: '',
      ai: {
        assistant: null,
        thread: null,
        messages: [],
        runId: null,
      },
    },
  },
  reducers: {
    setOnboardingState: (state, action) => {
      state.onboardingState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setup.fulfilled, (state, action) => {
      state.loaded = true;
      state.session = action.payload.session;
      state.signedIn = !!action.payload.session;
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      state.session = action.payload;
      state.signedIn = true;
      state.loaded = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setOnboardingState } = counterSlice.actions;

export default counterSlice.reducer;
