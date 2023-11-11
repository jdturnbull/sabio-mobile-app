import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async () => {
  try {
    const session = await AsyncStorage.getItem('session');

    if (session) {
      try {
        const { id } = JSON.parse(session);
        const valid = await call('GET', `users/session/${id}`);

        if (valid) {
          return { session: JSON.parse(session) };
        }

        await AsyncStorage.removeItem('session');
      } catch (error) {
        console.log(error);
      }
    }

    return { session: null };
  } catch (error) {}
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
  } catch (err) {
    console.log(err);
  }
});

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    error: null,
    loaded: false,
    loading: false,
    signedIn: false,
    session: null,
    assistant: null,
    thread: null,
    messages: [],
    runId: null,
    onboardingState: {
      assistant: null,
      thread: null,
      messages: [],
      dataGathered: {},
      runId: null,
    },
  },
  reducers: {
    updateState: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setOnboardingState: (state, action) => {
      state.onboardingState = action.payload;
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
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      if (action.payload) {
        state.session = action.payload;
        state.signedIn = true;
        state.loaded = true;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { setOnboardingState, setSelectedDate, updateState } = counterSlice.actions;

export default counterSlice.reducer;
