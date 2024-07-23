import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Title from '../../components/shared/Title';
import SelectableItem from '../../components/shared/SelectableItem';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import SubHeader from '../../components/shared/SubHeader';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const LOCATIONS = [
  'Home (indoor only)',
  'Home (indoor & outdoor)',
  'Home (outdoor only)',
  'Gym',
  'All options',
  'Custom',
];

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

const WhereTrain = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState([]);
  const [description, setDescription] = useState('');

  const heightAnim = useSharedValue(0);

  useEffect(() => {
    if (selected.includes('Custom')) {
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
    setSelected((prevSelected) => {
      if (value === 'All options') {
        return ['All options'];
      }

      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        const newSelected = [...prevSelected, value];
        if (newSelected.includes('All options')) {
          return newSelected.filter((item) => item !== 'All options');
        }
        return newSelected;
      }
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      Alert.alert('Please select at least one option');
      return;
    }
    if (selected.includes('Custom') && !description) {
      Alert.alert('Please enter a description');
      return;
    }
    const trainingLocations = selected.includes('Custom')
      ? [...selected.filter((item) => item !== 'Custom'), description].join(', ')
      : selected.join(', ');

    dispatch(updateState({ loseWeight: { trainingLocations } }));

    navigation.navigate('WeightEntry');
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title style={{ marginBottom: 10 }}>Where do you want to train?</Title>
          <SubHeader>Choose your training locations</SubHeader>
          <OptionsContainer>
            {LOCATIONS.map((opt) => {
              return (
                <SelectableItem
                  key={opt}
                  label={opt}
                  onPress={() => handlePress(opt)}
                  selected={selected.includes(opt)}
                />
              );
            })}
          </OptionsContainer>
          <CustomInputContainer style={animatedStyle}>
            <CustomInput
              style={{ flex: 1 }}
              label={'Custom Locations'}
              placeholder={'Describe the location'}
              value={description}
              setValue={setDescription}
            />
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

export default WhereTrain;
