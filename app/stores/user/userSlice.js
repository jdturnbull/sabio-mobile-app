import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const signout = createAsyncThunk('user/signout', async () => {
  await AsyncStorage.removeItem('session');
});

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

      console.log(session);

      await AsyncStorage.setItem('session', JSON.stringify(session));

      return session;
    } else {
      // Error with Apple Signin
    }
  } catch (err) {
    console.log(err);
  }
});

export const getPlan = createAsyncThunk('user/getPlan', async (data, { getState }) => {
  try {
    const userId = getState().user.session?.user.id;

    // Stage is the stage of loading for the waiting screen
    const response = await call('GET', `users/retrievePlan/${userId}`);
    return response;
  } catch (error) {
    console.log('Error getting plan', error);
  }
});

export const getActions = createAsyncThunk('user/getActions', async (data, { getState }) => {
  try {
    const user = getState().user.session?.user;

    const actions = await call('GET', `users/retrieveActions/${user.id}`);
    return actions;
  } catch (error) {
    console.log('Error getting actions', error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    error: null,
    loaded: false,
    loading: false,
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
    });
    builder.addCase(signout.fulfilled, (state, action) => {
      state.signedIn = false;
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      if (action.payload) {
        state.session = action.payload;
        state.signedIn = true;
        state.loaded = true;
      }
    });
    builder.addCase(getPlan.fulfilled, (state, action) => {
      state.plannedActivities = action.payload.plan.data;
      state.plannedMonths = action.payload.plan.months;
      state.session = { ...state.session, user: action.payload.user };
    });
    builder.addCase(getActions.fulfilled, (state, action) => {
      state.actions = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedDate, updateState } = userSlice.actions;

export default userSlice.reducer;
