import React, { useState, useEffect } from 'react';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import SelectableItem from '../../components/shared/SelectableItem';
import CustomInput from '../../components/shared/CustomInput';
import DropDownSelector from '../../components/shared/DropDownSelector';
import NextButton from '../../components/shared/NextButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const OPTIONS = ['5km', '10km', '10 Miles', 'Half Marathon', 'Marathon', 'Custom'];
const UNITS = ['Km', 'Miles'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const CustomInputContainer = styled(Animated.View)`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const RunDistance = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('5km');
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('Km');
  const heightAnim = useSharedValue(0);

  useEffect(() => {
    if (selected === 'Custom') {
      heightAnim.value = withTiming(70, { duration: 300 });
    } else {
      heightAnim.value = withTiming(0, { duration: 300 });
    }
  }, [selected, heightAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
    };
  });

  const handlePress = (value) => {
    Keyboard.dismiss();
    setSelected(value);
  };

  const handleContinue = () => {
    if (!selected) {
      Alert.alert('Please select a distance');
      return;
    }

    if (selected === 'Custom' && !distance) {
      Alert.alert('Please enter a distance');
      return;
    }

    if (selected === 'Custom' && !unit) {
      Alert.alert('Please select a unit');
      return;
    }

    if (selected === 'Custom' && distance > 60) {
      Alert.alert('Please enter a distance below 60');
      return;
    }

    if (selected === 'Custom' && distance < 5) {
      Alert.alert('Please select a distance of 5 or more');
      return;
    }
    const _distance = selected === 'Custom' ? `${distance} ${unit}` : selected;

    dispatch(updateState({ runDistance: { distance: _distance } }));

    navigation.navigate('SelectTerrain');
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title style={{ marginBottom: 10 }}>Select a distance</Title>
          <SubHeader>Select the distance you'd like to train for</SubHeader>
          <OptionsContainer>
            {OPTIONS.map((opt) => {
              return <SelectableItem key={opt} label={opt} onPress={handlePress} selected={selected === opt} />;
            })}
          </OptionsContainer>
          <CustomInputContainer style={animatedStyle}>
            <CustomInput
              style={{ flex: 1, marginRight: 15 }}
              label={'Distance'}
              placeholder={'5 - 60'}
              value={distance}
              setValue={setDistance}
              keyboardType={'numeric'}
            />
            <DropDownSelector items={UNITS} value={unit} setValue={setUnit} label={'Units'} />
          </CustomInputContainer>
          <View style={{ flex: 1 }} />
          <NextButton onPress={handleContinue} style={{ marginBottom: 20 }}>
            Continue
          </NextButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default RunDistance;
