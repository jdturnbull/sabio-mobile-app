import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import { ScrollView, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import call from '../../../../utils/call';
import getIconFromActivity from '../../../../utils/getIconFromActivity';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding-top: 20px;
  padding-horizontal: 20px;
`;

const DayTitle = styled.Text`
  font-size: ${(props) => props.theme.text.size.lg};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.lg};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.colors.white};
  margin-left: 10px;
`;

const ActivityContainer = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ActivityName = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  line-height: 25px;
  margin-left: 10px;
`;

const ActivityBody = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.text.size.sm};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-top: 10px;
`;

const ViewActivity = ({ fetchActivities }) => {
  const route = useRoute();

  const { _day } = route.params;
  const { day, date, activities } = _day;

  const [loading, setLoading] = useState(true);
  const [_activities, _setActivities] = useState(activities);

  return (
    <Container>
      <DayTitle>{moment(date).format('dddd, MMMM Do')}</DayTitle>
      {_activities.map((activity) => {
        const Icon = getIconFromActivity(activity.icon, true);
        return (
          <ActivityContainer key={activity.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon />
              <ActivityName>{activity.title}</ActivityName>
            </View>
            <ActivityBody>{activity.details}</ActivityBody>
          </ActivityContainer>
        )
      })}
    </Container>
  );
};

export default ViewActivity;
