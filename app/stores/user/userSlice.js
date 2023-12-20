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
        const updatedSession = await call('GET', `users/session/${id}`);

        if (updatedSession) {
          await AsyncStorage.setItem('session', JSON.stringify(updatedSession));
          return { session: updatedSession };
        } else {
          await AsyncStorage.removeItem('session');
        }
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

export const getPlan = createAsyncThunk('user/getPlan', async (data, { getState }) => {
  try {
    const user = getState().user.session?.user;

    // Stage is the stage of loading for the waiting screen
    const { plan, stage } = await call('GET', `users/retrievePlan/${user.id}`);
    return { plan, stage };
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
    stage: 0,
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
      state.stage = action.payload.stage;
    });
    builder.addCase(getActions.fulfilled, (state, action) => {
      state.actions = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedDate, updateState } = userSlice.actions;

export default userSlice.reducer;
