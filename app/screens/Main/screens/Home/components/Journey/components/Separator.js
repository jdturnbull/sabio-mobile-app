import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useSelector } from 'react-redux';

const SeparatorContainer = styled.View`
  width: 100%;
  z-index: -1;
`;

const SeparatorTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 10px;
`;

const SeparatorDiv = styled.View`
  width: 30%;
  height: 1px;
  background-color: ${(props) => props.theme.home.separatorColor};
`;

const SeparatorTitle = styled.Text`
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  text-align: center;
  color: ${(props) => props.theme.home.separatorColor};
`;

const SeparatorBody = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
  margin-top: 8px;
  margin-bottom: 35px;
`;

const SeparatorBodyText = styled.Text`
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.sm};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  text-align: center;
  color: ${(props) => props.theme.home.separatorColor};
`;

const Separator = ({ item, startOfWeekDates }) => {
  const user = useSelector((state) => state.user.session?.user);

  let weekNumber = 0;
  const date = moment.utc(item.leadingItem?.date, 'YYYY-MM-DD').format('YYYY-MM-DD');

  if (startOfWeekDates.includes(date)) {
    weekNumber = startOfWeekDates.indexOf(date) + 1;
    const focus = user?.weeklyFocuses[`week ${weekNumber}`];

    return (
      <SeparatorContainer>
        <SeparatorTop>
          <SeparatorDiv />
          <SeparatorTitle>{`Week ${weekNumber}`}</SeparatorTitle>
          <SeparatorDiv />
        </SeparatorTop>
        <SeparatorBody>
          <SeparatorBodyText>{focus || ''}</SeparatorBodyText>
        </SeparatorBody>
      </SeparatorContainer>
    );
  }
};

export default Separator;
