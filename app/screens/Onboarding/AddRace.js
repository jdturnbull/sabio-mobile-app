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
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DropDownSelector from '../../components/shared/DropDownSelector';

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

const TERRAINS = ['Flat', 'Rolling', 'Moderate', 'Hilly', 'Custom'];

const UNITS = ['Km', 'Miles'];

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
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

  const [name, setName] = useState('');
  const [date, setDate] = useState(moment.utc().format('YYYY-MM-DD'));
  const [category, setCategory] = useState('Run');
  const [distance, setDistance] = useState('');
  const [terrain, setTerrain] = useState('Flat');
  const [unit, setUnit] = useState('Km');

  const [distanceShown, setDistanceShown] = useState(true);
  const distanceHeight = useSharedValue(70); // initial height of the CustomInput component

  const handleSubmit = () => navigation.navigate('RateAbility');

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
          <Title style={{ marginBottom: 10, marginTop: 10 }}>Add a new race</Title>
          <SubHeader>Enter the race details below</SubHeader>
          <CustomDivider />
          <CustomInput label={'Race name'} placeholder={'The name of your race'} value={name} setValue={setName} />
          <DateInput label={'Race date'} value={date} setValue={setDate} />
          <HorizontalScrollSelection
            label={'Category'}
            items={CATEGORIES}
            value={category}
            setValue={setCategory}
            customLabel={'Custom Category'}
            customPlaceholder={'Race category'}
          />
          <Animated.View style={[animatedStyle, { marginTop: distanceShown ? 30 : 20 }]}>
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
          />
        </Container>
        <View style={{ marginBottom: 30, paddingHorizontal: 20 }}>
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
