import React from 'react';
import styled, { useTheme } from 'styled-components';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { getIconFromLabel } from '../../../../../../utils/icon';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.homeHeaderBackground};
  padding-left: 20px;
  padding-right: 0px;
  border-radius: 15px;
  margin-horizontal: 15px;
`;

const Left = styled.View`
  flex: 1;
  padding-vertical: 20px;
`;

const StyledTextTop = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const StyledTextBottom = styled.Text`
  margin-top: 5px;
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-family: ${(props) => props.theme.text.family};
  color: ${(props) => props.theme.text.colors.secondary};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  line-height: 20px;
`;

const Top = ({ viewableItems, setShowPlan }) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const user = useSelector((state) => state.user.session?.user);
  const monthlyFocuses = user?.monthlyFocuses || [];
  const plannedMonths = useSelector((state) => state.user?.plannedMonths);
  const ReadIcon = getIconFromLabel('sabioSmall');

  const month = moment(viewableItems[0]?.item.date, 'YYYY-MM-DD').format('MMMM YYYY').toUpperCase();

  const monthIndex = plannedMonths.indexOf(month) + 1;

  const handlePress = () => {
    setShowPlan(true);
  };

  return (
    <Container>
      <Left>
        <StyledTextTop>{`${month}, MONTH ${monthIndex}`}</StyledTextTop>
        <StyledTextBottom>{monthlyFocuses[month] || ''}</StyledTextBottom>
      </Left>
      <Pressable
        // onPress={handlePress}
        style={{
          ...styles.pressable,
          borderColor: colorScheme === 'light' ? theme.text.colors.secondaryInverse : theme.colors.darkBrown,
        }}>
        <ReadIcon />
      </Pressable>
    </Container>
  );
};
export default Top;

const styles = StyleSheet.create({
  bottomHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8F8F8',
    fontFamily: 'Noto Sans',
  },
  bottomMain: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff99',
    fontFamily: 'Noto Sans',
  },
  left: {
    flex: 1,
    paddingVertical: 20,
  },
  pressable: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderLeftWidth: 2,
  },
});
