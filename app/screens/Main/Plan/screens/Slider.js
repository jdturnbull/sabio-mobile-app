import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import ArrowRight from '../../../../assets/icons/24x/ArrowRight';

import WeekView from '../components/WeekView';

const Container = styled.View`
  flex: 1;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;

const HeaderTouchable = styled(TouchableOpacity)`
  width: 25px;
`;

const HeaderText = styled.Text`
  flex: 1;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
  text-align: center;
`;

const Scrollable = styled(ScrollView)`
  flex: 1;
`;

const WeekContainer = styled.View`
  width: ${Dimensions.get('window').width}px;
  padding-horizontal: 20px;
`;

const Slider = ({ weeks }) => {
  const scrollViewRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const handlePrev = () => {
    if (visibleIndex > 0) {
      setVisibleIndex((prev) => prev - 1);
      scrollViewRef.current.scrollTo({ x: (visibleIndex - 1) * Dimensions.get('window').width, animated: true });
    }
  };

  const handleNext = () => {
    if (visibleIndex !== weeks.length - 1) {
      setVisibleIndex((prev) => prev + 1);
      scrollViewRef.current.scrollTo({ x: (visibleIndex + 1) * Dimensions.get('window').width, animated: true });
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setVisibleIndex(index);
  };

  return (
    <Container>
      <Header>
        <HeaderTouchable onPress={handlePrev}>
          <ArrowLeft style={visibleIndex === 0 ? { display: 'none' } : {}} />
        </HeaderTouchable>
        <HeaderText>{`Week ${weeks[visibleIndex]?.week || ''}`}</HeaderText>
        <HeaderTouchable onPress={handleNext}>
          <ArrowRight style={visibleIndex === weeks.length - 1 ? { display: 'none' } : {}} />
        </HeaderTouchable>
      </Header>
      <Scrollable
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}>
        {weeks.map((week, index) => (
          <WeekContainer key={index}>
            <WeekView week={week} />
          </WeekContainer>
        ))}
      </Scrollable>
    </Container>
  );
};

export default Slider;
