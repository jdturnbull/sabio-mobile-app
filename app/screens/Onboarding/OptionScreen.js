import React from 'react';
import styled, { useTheme } from 'styled-components';
import { getIconFromLabel } from '../../utils/icon';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background1};
  padding-top: ${(props) => props.theme.spacing.safeAreaViewSmall};
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`;

const Headline = styled.Text`
  margin-top: 10%;
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const SubHeader = styled.Text`
  color: ${(props) => props.theme.colors.labelColor};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const OptionScreen = () => {
  const theme = useTheme();
  const { navigate } = useNavigation();

  const user = useSelector((state) => state.user.session.user);

  const handleChatPress = () => {
    navigate('Chat');
  };

  const handleQuickStart = () => {
    navigate('QuickStart');
  };

  return (
    <Container>
      <Content>
        <Headline style={{ color: theme.text.colors.primary }}>
          <Headline>Hi, </Headline>
          {user.name.split(' ')[0]}!
        </Headline>
        <Headline style={{ fontSize: 20, marginTop: 20, marginBottom: 50 }}>
          Before creating your plan, let's get to know eachother
        </Headline>
        <SubHeader>I'll ask about your goals, limitations, lifestyle and more.</SubHeader>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Touchable
            onPress={handleChatPress}
            style={{ backgroundColor: theme.colors.primary, marginRight: 5, flex: 1 }}>
            <Text style={{ color: theme.text.colors.secondary, fontWeight: 600, textAlign: 'center' }}>
              Chat (5 mins)
            </Text>
          </Touchable>
          <Touchable
            onPress={handleQuickStart}
            style={{
              backgroundColor: 'transparent',
              borderColor: theme.colors.primary,
              borderWidth: 1,
              marginLeft: 5,
              flex: 1,
            }}>
            <Text style={{ color: theme.colors.primary, fontWeight: 600, textAlign: 'center' }}>Quick Start</Text>
          </Touchable>
        </View>
      </Content>
    </Container>
  );
};

export default OptionScreen;

/*
- past experience
- height
- weight
- body composition
- equipmentAndFacilitiesAccess
- lifestyleInformation
- injuriesOrHealthConcerns
- fitnessGoal
- questionsAndConcerns
- activityType
- age
- goalByDate
- restDays
- hasMadeConnection
*/
