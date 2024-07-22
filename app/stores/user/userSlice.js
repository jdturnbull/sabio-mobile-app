import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async (location) => {
  console.log(location)
  // Do we have an existing session?
  const session = await AsyncStorage.getItem('session');

  // We don't so return null
  if (!session) return { session: null, user: null };

  // We do, let's get the id and check if it's still active
  try {
    const { id } = JSON.parse(session);

    const response = await call('GET', `users/session/${id}`);

    const {
      updated_session,
      user,
      profile,
      injuries,
      medications,
      training_plans,
      chronic_conditions,
      preferences,
      schedules,
      progress_reports,
      conversations,
      connections,
      activities,
    } = response;

    // If the session is not active then clear storage and return null
    if (!updated_session?.active) {
      await AsyncStorage.removeItem('session');
      return { session: null, user: null };
    }

    // The session is still active, set the updated session in storage and return
    await AsyncStorage.setItem('session', JSON.stringify(updated_session));

    return {
      session: updated_session,
      user,
      profile,
      injuries,
      medications,
      training_plans,
      chronic_conditions,
      preferences,
      schedules,
      progress_reports,
      conversations,
      connections,
      activities,
    };
  } catch (error) {
    console.log('Setup failed')
    console.log(error.message);
  }
});

export const continueWithApple = createAsyncThunk('user/continueWithApple', async () => {
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const timezone = RNLocalize.getTimeZone();
    const { user, session } = await call('POST', 'auth/apple', { ...response, timezone });

    await AsyncStorage.setItem('session', JSON.stringify(session));

    return { session, user };
  } catch (error) {
    console.log(error);
  }
});

export const update = createAsyncThunk('users/update', async ({ data, userId }) => {
  try {
    await call('POST', 'users/update', { userId, data });
    return data;
  } catch (error) {

  }
});

export const updateProfile = createAsyncThunk('users/updateProfile', async ({ data, userId }) => {
  try {
    await call('POST', 'users/updateProfile', { userId, data });
    return data;
  } catch (error) {

  }
});

export const addNewPlan = createAsyncThunk('users/addNewPlan', async ({ userId, planId }) => {
  try {
    const response = await call('POST', 'users/addNewPlan', { userId, planId });
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const activatePlan = createAsyncThunk('users/activatePlan', async ({ userId, planId }) => {
  try {
    const response = await call('POST', 'users/activatePlan', { userId, planId });
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: true,
    session: null,
    user: null,
    profile: null,
    injuries: [],
    medications: [],
    training_plans: [],
    chronic_conditions: [],
    preferences: [],
    schedules: [],
    progress_reports: [],
    conversations: [],
    connections: [],
    activities: [],
    showSubscribeModal: false,
  },
  reducers: {
    updateState: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setup.fulfilled, (state, action) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.injuries = action.payload.injuries;
      state.medications = action.payload.medications;
      state.training_plans = action.payload.training_plans;
      state.chronic_conditions = action.payload.chronic_conditions;
      state.preferences = action.payload.preferences;
      state.schedules = action.payload.schedules;
      state.progress_reports = action.payload.progress_reports;
      state.conversations = action.payload.conversations;
      state.connections = action.payload.connections;
      state.activities = action.payload.activities;
      state.loading = false;
    });
    builder.addCase(continueWithApple.fulfilled, (state, action) => {
      if (action.payload) {
        state.session = action.payload.session;
        state.user = action.payload.user;
      }
    });
    builder.addCase(update.fulfilled, (state, action) => {
      Object.assign(state.user, action.payload);
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      Object.assign(state.profile, action.payload);
    });
    builder.addCase(addNewPlan.fulfilled, (state, action) => {
      state.user = action.payload;
      state.profile = null;
      state.injuries = [];
      state.medications = [];
      state.training_plans = [];
      state.chronic_conditions = [];
      state.preferences = [];
      state.schedules = [];
      state.progress_reports = [];
      state.conversations = [];
      state.connections = [];
      state.activities = [];
    });
    builder.addCase(activatePlan.fulfilled, (state, action) => {
      state.profile = action.payload.profile;
      state.injuries = action.payload.injuries;
      state.medications = action.payload.medications;
      state.training_plans = action.payload.training_plans;
      state.chronic_conditions = action.payload.chronic_conditions;
      state.preferences = action.payload.preferences;
      state.schedules = action.payload.schedules;
      state.progress_reports = action.payload.progress_reports;
      state.conversations = action.payload.conversations;
      state.connections = action.payload.connections;
      state.activities = action.payload.activities;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateState } = userSlice.actions;

export default userSlice.reducer;
