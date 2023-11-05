import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import * as RNLocalize from 'react-native-localize';
import { useDatabase } from '../../data/database';
import call from '../../utils/call';

export const setup = createAsyncThunk('user/setup', async () => {
  try {
    const database = useDatabase();
    const session = JSON.parse(await AsyncStorage.getItem('session'));

    if (session) {
      const uRes = await database.collections.get('user').query().fetch();
      const user = await call('GET', `users/${session.userId}`);

      if (uRes.length === 0) {
        // Add user
        await database.collections.get('user').create((record) => {});

        // Sync
        // await sync();
      }
    }

    return { session };
  } catch (error) {
    console.log(error.message);
  }
});

export const continueWithApple = createAsyncThunk('user/continueWithApple', async () => {
  const database = useDatabase();

  try {
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { email, fullName, identityToken } = appleAuthResponse;

    if (identityToken) {
      const name = `${fullName.givenName || ''} ${fullName.familyName || ''}`;

      const timezone = RNLocalize.getTimeZone();
      const session = await call('POST', 'users/auth', { identityToken, timezone, email, name });
      const user = await call('GET', `users/${session.userId}`);

      await AsyncStorage.setItem('session', JSON.stringify(session));

      await database.action(async () => {
        await database.collections.get('user').create((record) => {
          record._raw.id = 'USER';
          // Add fields from user
          record._raw._status = 'synced';
        });
      });

      // return data
    } else {
      // Sign in error
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setup.pending, (state, action) => {})
      .addCase(setup.fulfilled, (state, action) => {
        state.loaded = true;
        state.session = action.payload.session;
      })
      .addCase(setup.rejected, (state, action) => {});
    builder
      .addCase(continueWithApple.pending, (state, action) => {})
      .addCase(continueWithApple.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
