import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { save } from '../../stores/onboarding/onboardingSlice';
import { setup } from '../../stores/user/userSlice';

const Container = styled.View`
  padding: 20px;
`;

const CreatingPlan = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);
  const user_state = useSelector((state) => state.user);

  const intervalRef = useRef(null);

  // Checks to see if it should send data to backend
  useEffect(() => {
    if (user_state.user.onboarding_status === 'NOT_STARTED' && state.profile) {
      dispatch(save(state));
    }
  }, []);

  useEffect(() => {
    dispatch(setup());

    if (user_state.user.onboarding_status !== 'COMPLETE') {
      intervalRef.current = setInterval(() => {
        dispatch(setup());
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <Container />;
};

export default CreatingPlan;
