import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async () => {
  // Do we have an existing session?
  const session = await AsyncStorage.getItem('session');

  // We don't so return null
  if (!session) return { session: null, user: null };

  // We do, let's get the id and check if it's still active
  try {
    const { id } = JSON.parse(session);
    const { updated_session, user } = await call('GET', `users/session/${id}`);

    // If the session is not active then clear storage and return null
    if (!updated_session?.active) {
      await AsyncStorage.removeItem('session');
      return { session: null, user: null };
    }

    // The session is still active, set the updated session in storage and return
    await AsyncStorage.setItem('session', JSON.stringify(updated_session));
    return { session: updated_session, user };
  } catch (error) {
    console.log(error);
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

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: true,
    session: null,
    user: null,
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
export const { updateState } = userSlice.actions;

export default userSlice.reducer;
