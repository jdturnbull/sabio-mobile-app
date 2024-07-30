import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import Clear from '../../assets/icons/24x/Clear';
import SmartPrinciples from '../../components/shared/SmartPrinciples';
import { ScrollView } from 'react-native-gesture-handler';
import retrieveCompletion from '../../utils/retrieveCompletion';
import { useDispatch } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const HighlightText = styled.Text`
  color: #a1aad3;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  height: ${() => `${screenHeight - 240}px`};
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-color: black;
  shadow-offset: 2px 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ModalHeader = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const HeaderText = styled.Text`
  flex: 1;
  margin-right: 50px;
  text-align: center;
  color: #f8f8f8;
  font-size: ${(props) => props.theme.text.size.md};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const CustomGoal = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleDropdown = () => setModalVisible(false);

  const handleSubmit = async () => {
    if (!goal) {
      Alert.alert('Please enter a goal');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Is this a fitness related goal? if yes then respond 'yes' if no then respond with 'no'\nFitness Goal: ${goal}`;
      const isValid = await retrieveCompletion({ prompt, model: 'gpt-3.5-turbo' });

      if (isValid.toLowerCase() === 'no') {
        setLoading(false);
        Alert.alert('Please enter a specific fitness related goal');
        return;
      }

      dispatch(updateState({ customGoal: { goal } }));

      setLoading(false);

      navigation.navigate('RateAbility');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title style={{ marginBottom: 10 }}>Enter a custom goal</Title>
        <TouchableOpacity style={{ paddingBottom: 10, marginBottom: 30 }} onPress={() => setModalVisible(true)}>
          <SubHeader>
            Help Sabio by using a <HighlightText>(i) S.M.A.R.T goal</HighlightText>
          </SubHeader>
        </TouchableOpacity>
        <CustomInput label={'Custom goal'} placeholder={'Your goal'} value={goal} setValue={setGoal} multiline={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {loading && <ActivityIndicator />}
        </View>
        <NextButton onPress={handleSubmit} style={{ marginBottom: 20 }} />
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <ModalContainer>
            <TouchableOpacity style={{ flex: 1 }} onPress={toggleDropdown} />
            <ModalContent>
              <ModalHeader>
                <TouchableOpacity style={{ width: 50 }} onPress={toggleDropdown}>
                  <Clear />
                </TouchableOpacity>
                <HeaderText>S.M.A.R.T Principles</HeaderText>
              </ModalHeader>
              <ScrollView>
                <SmartPrinciples />
              </ScrollView>
            </ModalContent>
          </ModalContainer>
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default CustomGoal;
