import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useColorScheme } from 'react-native';
import { getIconFromLabel } from '../../../../../utils/icon';
import { useSelector } from 'react-redux';

const Container = styled.View`
  margin-top: 50px;
  padding-bottom: 10px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ItemText = styled.Text`
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  margin-left: 5px;
`;

const Header = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const user = useSelector((state) => state.user?.session?.user);

  const StreakIcon = getIconFromLabel('streak');
  const ConfidenceIcon = getIconFromLabel('confidence');

  return (
    <Container>
      <ItemContainer>
        {/* <ConfidenceIcon color={colorScheme === 'dark' ? theme.colors.white : null} />
        <ItemText>80%</ItemText> */}
      </ItemContainer>
      <ItemContainer style={{ justifyContent: 'flex-end' }}>
        <StreakIcon color={colorScheme === 'dark' ? theme.colors.white : null} />
        <ItemText>{user?.streak || 0}</ItemText>
      </ItemContainer>
    </Container>
  );
};

export default Header;
