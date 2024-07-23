import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import call from '../../../../utils/call';
import getIconFromActivity from '../../../../utils/getIconFromActivity';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding-top: 20px;
  padding-horizontal: 20px;
`;

const DayTitle = styled.Text`
  font-size: ${(props) => props.theme.text.size.lg};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 40px;
`;

const ActivityContainer = styled.View`
  margin-bottom: 20px;
`;

const ActivityTop = styled.View`
`;

const ActivityBottom = styled.View``;

const ActivityName = styled.Text`
  margin-top: 10px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.text.size.md};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  margin-bottom: 20px;
`;

const ActivityBody = styled.Text``;

const CenteredActivityIndicator = styled(ActivityIndicator)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ViewActivity = ({ fetchActivities }) => {
  const route = useRoute();

  const { _day } = route.params;
  const { day, date, activities } = _day;

  const [loading, setLoading] = useState(true);
  const [_activities, _setActivities] = useState(activities);

  const generateActivityContent = async () => {
    try {
      setLoading(true);
      const response = await call('POST', 'users/generateActivityContent', { date, planId: activities[0].training_plan_id });
      await fetchActivities();
      _setActivities(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    let shouldGenerate = false;

    for (let i = 0; i < _activities.length; i++) {
      if (_activities[i].description === "" || _activities[i].guidance === "") {
        shouldGenerate = true;
        break;
      }
    }

    if (shouldGenerate) {
      generateActivityContent();
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <Container>
      <DayTitle>{moment(date).format('dddd, MMMM Do')}</DayTitle>
      {_activities.map((activity) => {
        const Icon = getIconFromActivity(activity.icon);
        return (
          <ActivityContainer key={activity.id}>
            <ActivityTop>
              <Icon />
              <ActivityName>{activity.title}</ActivityName>
            </ActivityTop>
            <ActivityBottom>
              {loading ? (
                <CenteredActivityIndicator color="#f8f8f8" />
              ) : (
                <>
                  <ActivityBody>{activity.description}</ActivityBody>
                  <ActivityBody>{activity.guidance}</ActivityBody>
                </>
              )}
            </ActivityBottom>
          </ActivityContainer>
        )
      })}
    </Container>
  );
};

export default ViewActivity;
