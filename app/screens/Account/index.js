import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import Top from './components/Top';
import SubscribePrompt from './components/SubscribePrompt';
import NotificationPrompt from './components/NotificationPrompt';
import Course from '../../assets/icons/24x/Course';
import Bell from '../../assets/icons/24x/Bell';
import Privacy from '../../assets/icons/24x/Privacy';
import OptionBox from '../../components/authed/OptionBox';
import ConnectStrava from './components/ConnectStrava';


const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
`;

const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const Main = styled(ScrollView)`
  flex: 1;
  margin-top: 30px;
`;

const Account = () => {
  const navigation = useNavigation();
  const route = useNavigation().getState().routes.find(r => r.name === 'Account');
  const params = route ? route.params : {};

  const connections = useSelector((state) => state.user.connections);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      navigation.goBack();
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const user = useSelector((state) => state.user?.user);

  const showInfo = !user.first_screen_views['Account'];

  const [hideSubscribe, setHideSubscribe] = useState(user?.subscription_status === 'UNSUBSCRIBED')
  const [hideSetNotif, setHideSetNotif] = useState(user?.notifications_enabled && user?.notification_settings?.hide_prompt);

  useEffect(() => {
    if (user) setHideSetNotif(user?.notifications_enabled || user?.notification_settings?.hide_prompt);
    if (user) setHideSubscribe(user?.subscription_status === 'SUBSCRIBED');
  }, [user, connections])

  const handleOptionPress = (opt) => {
    if (opt === 'Manage your plans') {
      navigation.navigate('ManagePlan');
    } else if (opt === 'Notification settings') {
      navigation.navigate('NotificationSettings');
    } else if (opt === 'Privacy settings') {
      navigation.navigate('Privacy');
    }
  }

  useEffect(() => {
    if (params?.option) {
      handleOptionPress(params.option);
    }
  }, [params])


  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={handleBack} style={{ width: 50 }}>
          <ArrowLeft />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 50,
            alignItems: 'center',
          }}>
          <HeaderText>Account</HeaderText>
        </View>
      </Header>
      <Main showsVerticalScrollIndicator={false}>
        <Top />
        {!hideSetNotif && <NotificationPrompt />}
        {!hideSubscribe && <SubscribePrompt />}
        <View style={{ marginVertical: 10, width: '100%' }}>
          <OptionBox label="Manage your plans" Icon={Course} onPress={handleOptionPress} />
          <OptionBox label="Notification settings" Icon={Bell} onPress={handleOptionPress} />
          <OptionBox label="Privacy settings" Icon={Privacy} onPress={handleOptionPress} />
          <ConnectStrava />
        </View>
      </Main>

    </Container >
  );
};

export default Account;
