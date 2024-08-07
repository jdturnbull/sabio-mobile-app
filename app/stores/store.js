import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import onboardingReducer from './onboarding/onboardingSlice';
import chatReducer from './chat/chatSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    onboarding: onboardingReducer,
    chat: chatReducer,
  },
});
