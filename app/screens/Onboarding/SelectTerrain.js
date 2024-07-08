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
import NextButton from '../../components/onboarding/NextButton';
import SubHeader from '../../components/shared/SubHeader';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const TERRAINS = ['Flat', 'Rolling', 'Moderate', 'Hilly', 'All', 'Custom'];

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

const SelectTerrain = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const state = useSelector((state) => state.onboarding);

  const [selected, setSelected] = useState('Flat');
  const [description, setDescription] = useState('');

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
      Alert.alert('Please select an option');
      return;
    }
    if (selected === 'Custom' && !description) {
      Alert.alert('Please enter a description');
      return;
    }
    const terrain = selected === 'Custom' ? description : selected;

    if (state.race) {
      dispatch(updateState({ race: { ...state.race, terrain } }));
    } else {
      dispatch(updateState({ runDistance: { ...state.runDistance, terrain } }));
    }

    navigation.navigate('RateAbility');
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title style={{ marginBottom: 10 }}>Terrain selection</Title>
          <SubHeader>Choose the terrain for your training</SubHeader>
          <OptionsContainer>
            {TERRAINS.map((opt) => {
              return <SelectableItem key={opt} label={opt} onPress={handlePress} selected={selected === opt} />;
            })}
          </OptionsContainer>
          <CustomInputContainer style={animatedStyle}>
            <CustomInput
              style={{ flex: 1 }}
              label={'Custom Terrain'}
              placeholder={'Describe the terrain'}
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

export default SelectTerrain;
