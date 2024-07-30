import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import getIconFromActivity from '../../../../utils/getIconFromActivity';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import Title from '../../../../components/shared/Title';
import SubHeader from '../../../../components/shared/SubHeader';

const DAY_COLOR_MAP = {
  'Monday': '#885A89',
  'Tuesday': '#D4B483',
  'Wednesday': '#355834',
  'Thursday': '#6D466B',
  'Friday': '#FF8585',
  'Saturday': '#134074',
  'Sunday': '#FF3357',
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding-top: 20px;
  padding-horizontal: 20px;
`;

const ActivityContainer = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ActivityHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ActivityBody = styled.View`
  margin-vertical: 10px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 10px;
`;

const Left = styled.View`
  width: 30px;
  justify-content: center;
  align-items: center;
`;

const Right = styled.View`
  flex: 1;
`;

const NumberText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: 24px;
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const HeaderText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xs};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.bold};
  flex: 1;
`;

const ActivityTitle = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  margin-left: 5px;
`;

const ActivityBodyText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  color: ${(props) => props.theme.text.colors.grey};
  font-size: ${(props) => props.theme.text.size.sm};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
`;

const EmojiText = styled.Text``;

const ViewDay = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);
  const { _day } = route.params;
  const { day, date, activities } = _day;

  return (
    <Container>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>
        <Title style={{ marginBottom: 0, marginLeft: 10 }}>{moment(date).format('dddd, MMMM Do')}</Title>
      </View>
      <SubHeader style={{ marginBottom: 20 }}>Activities for the day</SubHeader>
      {activities.map((activity, i) => {
        return (
          <ActivityContainer key={activity.id}>
            <ActivityHeader color={DAY_COLOR_MAP[day]}>
              <HeaderText>Session</HeaderText>
            </ActivityHeader>
            <ActivityBody>
              <Left>
                <NumberText>{i + 1}</NumberText>
              </Left>
              <View style={{ marginLeft: 6, marginRight: 12, width: 2, backgroundColor: '#f8f8f810', height: '100%', borderRadius: 50 }} />
              <Right>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <EmojiText>{activity.icon}</EmojiText>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                </View>
                <ActivityBodyText>{activity.details}</ActivityBodyText>
              </Right>
            </ActivityBody>
          </ActivityContainer>
        )
      })}
    </Container>
  );
};

export default ViewDay;

// TODO NEXT: HOOK PROFILE CHANGES INTO PLAN