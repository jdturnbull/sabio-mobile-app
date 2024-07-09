import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { save } from '../../stores/onboarding/onboardingSlice';

const Container = styled.View`
  padding: 20px;
`;

const CreatingPlan = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(save({ state, user }));
    // then from the backend unify the data and save it in the db
    // then it's picked up by a engine that creates the plan
    // While all this is happening, I want a screen that is explaining how the app works to the user
  }, []);

  return <Container />;
};

export default CreatingPlan;
