import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Title from '../../components/shared/Title';
import CustomDivider from '../../components/shared/CustomDivider';
import CustomInput from '../../components/shared/CustomInput';
import SubHeader from '../../components/shared/SubHeader';
import DateInput from '../../components/shared/DateInput';
import HorizontalScrollSelection from '../../components/shared/HorizontalScrollSelection';
import { TouchableWithoutFeedback, Keyboard, View, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DropDownSelector from '../../components/shared/DropDownSelector';
import { useDispatch } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const CATEGORIES = [
  'Run',
  'Cycle',
  'Swim',
  'Sprint Triathlon',
  'Olympic Triathlon',
  'Half Ironman',
  'Ironman',
  'Custom',
];

const TERRAINS = ['Flat', 'Rolling', 'Moderate', 'Hilly', 'All', 'Custom'];

const UNITS = ['Km', 'Miles'];

const Container = styled.View`
  flex: 1;
`;

const distance_categories = ['Run', 'Swim', 'Cycle', 'Custom'];

const TouchableText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
`;

const AddRace = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [date, setDate] = useState(moment.utc().format('YYYY-MM-DD'));
  const [category, setCategory] = useState('Run');
  const [distance, setDistance] = useState('');
  const [terrain, setTerrain] = useState('Flat');
  const [unit, setUnit] = useState('Km');

  const [distanceShown, setDistanceShown] = useState(true);
  const distanceHeight = useSharedValue(70); // initial height of the CustomInput component

  const handleSubmit = () => {
    if (!name) {
      Alert.alert('Missing a race name');
    }

    const currentDate = moment.utc();
    const raceDate = moment.utc(date);
    const daysDifference = raceDate.diff(currentDate, 'days');

    if (daysDifference < 30) {
      Alert.alert('The race must be a minimum of a month away');
      return;
    }

    if (daysDifference > 365) {
      Alert.alert('The race must be a maximum of a year away');
      return;
    }

    if (!category) {
      Alert.alert('Missing a race category');
      return;
    }

    if (distanceShown && !distance) {
      Alert.alert('Missing a race distance');
      return;
    }

    if (!terrain) {
      Alert.alert('Please provide a terrain');
      return;
    }

    if (distanceShown && !unit) {
      Alert.alert('Missing distance units');
      return;
    }

    if (distance) {
      dispatch(updateState({ race: { name, date, category, distance, unit, terrain } }));
    } else {
      dispatch(updateState({ race: { name, date, category, terrain } }));
    }

    navigation.navigate('RateAbility');
  };

  useEffect(() => {
    if (distance_categories.includes(category)) {
      setDistanceShown(true);
      distanceHeight.value = withTiming(70, { duration: 300 }); // height of the CustomInput component
    } else {
      distanceHeight.value = withTiming(0, { duration: 300 });
      setDistanceShown(false);
    }
  }, [category]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: distanceHeight.value,
      overflow: 'hidden',
    };
  });

  return (
    <TouchableWithoutFeedback onLongPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        extraScrollHeight={80}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardOpeningTime={0}>
        <Container>
          <Title style={{ marginBottom: 10, marginTop: 10, paddingHorizontal: 20 }}>Add a new race</Title>
          <SubHeader style={{ paddingHorizontal: 20, marginBottom: 30 }}>Enter the race details below</SubHeader>
          <View style={{ paddingHorizontal: 20 }}>
            <CustomInput label={'Race name'} placeholder={'The name of your race'} value={name} setValue={setName} />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <DateInput label={'Race date'} value={date} setValue={setDate} />
          </View>
          <HorizontalScrollSelection
            label={'Category'}
            items={CATEGORIES}
            value={category}
            setValue={setCategory}
            customLabel={'Custom Category'}
            customPlaceholder={'Race category'}
            customInputStyle={{ paddingHorizontal: 20 }}
          />
          <Animated.View style={[animatedStyle, { marginTop: distanceShown ? 30 : 20, paddingHorizontal: 20 }]}>
            {distanceShown && (
              <View style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CustomInput
                  style={{ flex: 1, marginRight: 15 }}
                  label={'Distance'}
                  placeholder={'Race distance'}
                  value={distance}
                  setValue={setDistance}
                  keyboardType={'numeric'}
                />
                <DropDownSelector items={UNITS} value={unit} setValue={setUnit} label={'Units'} />
              </View>
            )}
          </Animated.View>
          <HorizontalScrollSelection
            label={'Terrain'}
            items={TERRAINS}
            value={terrain}
            setValue={setTerrain}
            customLabel={'Custom Terrain'}
            customPlaceholder={'Terrain description'}
            customInputStyle={{ paddingHorizontal: 20 }}
          />
        </Container>
        <View style={{ marginVertical: 20, paddingHorizontal: 20, marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#f8f8f8',
              padding: 12,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableText>Add Race</TouchableText>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default AddRace;
