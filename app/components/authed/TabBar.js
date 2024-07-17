import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';

import PlanIcon from '../../assets/icons/24x/Plan';
import ProgressIcon from '../../assets/icons/24x/Progress';
import CommunityIcon from '../../assets/icons/24x/Community';
import ProfileIcon from '../../assets/icons/24x/Profile';

import { hapticImpact } from '../../utils/haptics';

const Container = styled.View`
  height: 90px;
  width: ${(props) => `${props.width}px`};
  background-color: ${(props) => props.theme.colors.background2};
  shadow-color: #000;
  shadow-offset: {
    width: 0px;
    height: -4px;
  }
  shadow-opacity: 0.2;
  shadow-spread: 0px;
  shadow-radius: 5px;
`;

const Inner = styled.View`
  height: 90px;
  width: ${(props) => `${props.width}px`};
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.background2};
`;

const Touchable = styled(TouchableOpacity)`
  height: 100%;
  width: ${(props) => `${props.width}px`};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 15px;
  align-items: center;
`;

const TouchableText = styled.Text`
  color: ${(props) => (props.selected ? '#fff' : '#f8f8f840')};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.xs};
  margin-top: 5px;
`;

const ICON_MAP = { Plan: PlanIcon, Progress: ProgressIcon, Community: CommunityIcon, Profile: ProfileIcon };

const TabBar = ({ state, navigation, width }) => {
  const { routeNames: routes, index: activeIndex } = state;

  const handlePress = (route) => {
    hapticImpact();
    navigation.navigate(route);
  };

  return (
    <Container width={width}>
      <Inner>
        {routes.map((route, i) => {
          const Icon = ICON_MAP[route];
          const selected = i === activeIndex;

          return (
            <Touchable onPress={() => handlePress(route)} key={route} width={width / routes.length}>
              <Icon color={selected ? '#fff' : '#f8f8f840'} />
              <TouchableText selected={selected}>{route}</TouchableText>
            </Touchable>
          );
        })}
      </Inner>
    </Container>
  );
};

export default TabBar;
