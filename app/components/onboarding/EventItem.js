import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import Calendar from '../../assets/icons/18x/Calendar';
import ArrowRight from '../../assets/icons/24x/ArrowRight';
import Location from '../../assets/icons/18x/Location';
import { TouchableOpacity } from 'react-native';

const Container = styled.TouchableOpacity`
  padding: 10px;
  min-height: 100px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background2};
`;

const Top = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Mid = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Bottom = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled.Text`
  flex: 1;
  margin-left: 3px;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.sm};
  color: #f8f8f8;
`;

const SmallText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.xs};
  color: #a1aad350;
  margin-left: 5px;
  margin-bottom: 1px;
`;

const EventItem = ({ event, onPress }) => {
  const date_string = moment(event.start).format('ddd, D MMM YYYY');
  const date_type_string = event.type !== 'Race' ? `${date_string} • ${event.type}` : date_string;

  const city = event.city.charAt(0).toUpperCase() + event.city.slice(1).toLowerCase();
  const flag = getUnicodeFlagIcon(event.country_code);

  const handlePress = () => onPress(event);

  return (
    <Container onPress={handlePress}>
      <Top>
        <Calendar color={'#A1AAD350'} />
        <SmallText>{date_type_string}</SmallText>
      </Top>
      <Mid>
        <LabelText>{event.name}</LabelText>
        <TouchableOpacity>
          <ArrowRight color={'#A1AAD350'} />
        </TouchableOpacity>
      </Mid>
      <Bottom>
        <Location color={'#A1AAD350'} />
        <SmallText>{`${city}, ${event.country}  ${flag}`}</SmallText>
      </Bottom>
    </Container>
  );
};

export default EventItem;
