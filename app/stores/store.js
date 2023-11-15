import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import onboardingReducer from './onboarding/onboardingSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    onboarding: onboardingReducer,
  },
});
