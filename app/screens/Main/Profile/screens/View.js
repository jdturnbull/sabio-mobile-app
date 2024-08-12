import React, { useEffect } from 'react';
import styled from 'styled-components';
import SubHeader from '../../../../components/shared/SubHeader';
import { ScrollView } from 'react-native';
import OptionBox from '../components/OptionBox';
import { useNavigation } from '@react-navigation/native';
import Title from '../../../../components/shared/Title';
import Premium from '../../../../assets/icons/24x/Premium';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../../../stores/user/userSlice';
import InfoButton from '../../../../components/shared/InfoButton';

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const handlePress = (label) => {
    if (user?.subscription_status === 'UNSUBSCRIBED') {
      dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Profile' }))
      return;
    }

    const route = navigationMap[label];

    if (route) {
      navigation.navigate(route);
    }
  };

  const showInfo = !user.first_screen_views['Profile'];


  return (
    <Container>
      <Top>
        {user?.subscription_status === 'UNSUBSCRIBED' && <Premium />}
        <Title style={{ marginBottom: 2, marginLeft: user.subscription_status === 'UNSUBSCRIBED' ? 10 : 0, flex: 1 }}>Profile Information</Title>
        <InfoButton showInfo={showInfo} location={'Profile'} small />
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
