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
    } = response;

    // If the session is not active then clear storage and return null
    if (!updated_session?.active) {
      console.log('here');
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

export const addInjury = createAsyncThunk('users/addInjury', async ({ userId, injury }) => {
  try {
    const newInjury = await call('POST', 'users/addInjury', { userId, injury });
    return newInjury;
  } catch (error) {
    console.log(error);
  }
});

export const updateInjury = createAsyncThunk('users/updateInjury', async ({ injuryId, data }) => {
  try {
    const updatedInjury = await call('POST', 'users/updateInjury', { injuryId, data });
    return updatedInjury;
  } catch (error) {
    console.log(error);
  }
});

export const addMedication = createAsyncThunk('users/addMedication', async ({ userId, medication }) => {
  try {
    const newMedication = await call('POST', 'users/addMedication', { userId, medication });
    return newMedication;
  } catch (error) {
    console.log(error);
  }
});

export const updateMedication = createAsyncThunk('users/updateMedication', async ({ medicationId, data }) => {
  try {
    const updatedMedication = await call('POST', 'users/updateMedication', { medicationId, data });
    return updatedMedication;
  } catch (error) {
    console.log(error);
  }
});

export const updateChronicConditions = createAsyncThunk('users/updateChronicConditions', async ({ userId, chronic_conditions, details }) => {
  try {
    const updatedChronicConditions = await call('POST', 'users/updateChronicConditions', { userId, chronic_conditions, details });
    return updatedChronicConditions;
  } catch (error) {
    console.log(error);
  }
});

export const addPreference = createAsyncThunk('users/addPreference', async ({ userId, preference }) => {
  try {
    const newPreference = await call('POST', 'users/addPreference', { userId, preference });
    return newPreference;
  } catch (error) {
    console.log(error);
  }
});

export const updatePreference = createAsyncThunk('users/updatePreference', async ({ preferenceId, data }) => {
  try {
    const updatedPreference = await call('POST', 'users/updatePreference', { preferenceId, data });
    return updatedPreference;
  } catch (error) {
    console.log(error);
  }
});

export const addSchedule = createAsyncThunk('users/addSchedule', async ({ userId, schedule }) => {
  try {
    const newSchedule = await call('POST', 'users/addSchedule', { userId, schedule });
    return newSchedule;
  } catch (error) {
    console.log(error);
  }
});

export const updateSchedule = createAsyncThunk('users/updateSchedule', async ({ scheduleId, data }) => {
  try {
    const updatedSchedule = await call('POST', 'users/updateSchedule', { scheduleId, data });
    return updatedSchedule;
  } catch (error) {
    console.log(error);
  }
});

export const updateActiveSchedule = createAsyncThunk('users/updateActiveSchedule', async ({ scheduleId }) => {
  try {
    const updatedSchedules = await call('POST', 'users/updateActiveSchedule', { scheduleId });
    return updatedSchedules;
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
    plan_updating: false,
    training_plans: [],
    chronic_conditions: [],
    preferences: [],
    schedules: [],
    progress_reports: [],
    conversations: [],
    connections: [],
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
      state.plan_updating = true;
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
    });
    builder.addCase(addInjury.fulfilled, (state, action) => {
      state.injuries.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(updateInjury.fulfilled, (state, action) => {
      state.injuries = state.injuries.filter(injury => injury.id !== action.payload.id);
      state.injuries.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(addPreference.fulfilled, (state, action) => {
      state.preferences = state.preferences.filter(preference => preference.id !== action.payload.id);
      state.preferences.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(updatePreference.fulfilled, (state, action) => {
      state.preferences = state.preferences.filter(preference => preference.id !== action.payload.id);
      state.preferences.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(addMedication.fulfilled, (state, action) => {
      state.medications.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(updateMedication.fulfilled, (state, action) => {
      state.medications = state.medications.filter(medication => medication.id !== action.payload.id);
      state.medications.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(updateChronicConditions.fulfilled, (state, action) => {
      state.chronic_conditions = action.payload;
      state.plan_updating = true;
    });
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload.id);
      state.schedules.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(addSchedule.fulfilled, (state, action) => {
      state.schedules.push(action.payload);
      state.plan_updating = true;
    });
    builder.addCase(updateActiveSchedule.fulfilled, (state, action) => {
      state.schedules = action.payload;
      state.plan_updating = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateState } = userSlice.actions;

export default userSlice.reducer;
