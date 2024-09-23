import React, { useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SubHeader from '../../../../components/shared/SubHeader';
import { ScrollView } from 'react-native';
import OptionBox from '../components/OptionBox';
import { useNavigation } from '@react-navigation/native';
import Title from '../../../../components/shared/Title';
import Premium from '../../../../assets/icons/24x/Premium';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../../../stores/user/userSlice';
import InfoButton from '../../../../components/shared/InfoButton';
import { usePostHog } from 'posthog-react-native';

const navigationMap = {
  'Equipment and facilities': 'EquipmentAndFacilities',
  'Current ability': 'PastExperience',
  'Report an injury': 'Injuries',
  'Chronic conditions': 'ChronicIllness',
  'Training preferences': 'Preferences',
};

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding: 20px;
`;

const Top = styled.View`
  flex-direction: row;
  align-items: center;
  marginBottom: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
  width: 100%;
`;

const View = () => {
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const handlePress = (label) => {
    const route = navigationMap[label];
    // If the user is subscribed, navigate to the route
    if (user?.subscription_status === 'SUBSCRIBED') {
      posthog.capture('profile_option_pressed', { option: label });
      navigation.navigate(route);
      return;
    }

    // They are not subscribed, so check if their account is more than two weeks old
    const accountMoreThanTwoWeeksOld = moment().isAfter(moment(user?.created_at).add(2, 'weeks'));

    // If their account is less than two weeks old, allow them to change the activities
    if (!accountMoreThanTwoWeeksOld) {
      posthog.capture('profile_option_pressed', { option: label });
      navigation.navigate(route);
      return;
    }

    // Their account is more than two weeks old, so show the modal
    posthog.capture('tried_to_use_premium_feature', { feature: 'profile_option_press', option: label });
    dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Profile' }))
  };


  return (
    <Container>
      <Top>
        {user?.subscription_status === 'UNSUBSCRIBED' && <Premium />}
        <Title style={{ marginBottom: 2, marginLeft: user.subscription_status === 'UNSUBSCRIBED' ? 10 : 0, flex: 1 }}>Profile Information</Title>
        <InfoButton location={'Profile'} small />
      </Top>
      <SubHeader>Update information to customise your plan</SubHeader>
      <OptionsContainer>
        <OptionBox label={'Equipment and facilities'} onPress={handlePress} value={''} />
        <OptionBox label={'Current ability'} onPress={handlePress} value={''} />
        <OptionBox label={'Report an injury'} onPress={handlePress} value={''} />
        <OptionBox label={'Chronic conditions'} onPress={handlePress} value={''} />
        <OptionBox label={'Training preferences'} onPress={handlePress} value={''} />
      </OptionsContainer>
    </Container>
  );
};

export default View;
