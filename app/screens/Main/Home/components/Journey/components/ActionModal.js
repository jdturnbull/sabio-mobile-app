import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal } from 'react-native';
import styled, { useTheme } from 'styled-components';
import call from '../../../../../../utils/call';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan, updateState } from '../../../../../../stores/user/userSlice';

const Container = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.View`
  width: 80%;
  justify-content: center;
  align-items: center;
`;

const Input = styled.TextInput`
  background-color: ${(props) => props.theme.home.cards.rightBackground};
  color: ${(props) => props.theme.home.cards.iconPendingColor};
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  height: 60px;
  font-family: ${(props) => props.theme.text.family};
`;

const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.home.cards.rightBackground};
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CancelText = styled.Text`
  color: ${(props) => props.theme.home.cards.iconPendingColor};
  font-weight: bold;
  font-family: ${(props) => props.theme.text.family};
`;

const SubmitText = styled.Text`
  color: white;
  font-weight: bold;
  font-family: ${(props) => props.theme.text.family};
`;

const ActionModal = ({ visible, setVisible, action }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  const theme = useTheme();

  const user = useSelector((state) => state.user?.session?.user);

  useEffect(() => {
    if (!action) setPlaceholder('');
    if (action === 'replan_day') setPlaceholder("I'm tired, can we schedule something small?");
    if (action === 'replan_week') setPlaceholder('I rolled my ankle, can you replan?');
    if (action === 'feedback') setPlaceholder('What would you like to tell us?');
  }, [action]);

  const handleAction = async () => {
    setLoading(true);

    try {
      if (action === 'replan_day') {
        const response = await call('POST', `users/replanDay`, { description: value, userId: user?.id });
        if (response) {
          dispatch(getPlan());
        } else {
          Alert.alert('Error', 'There was an error updating your day. Please try again.');
        }
      }
      if (action === 'replan_week') {
        const response = await call('POST', `users/replanWeek`, { description: value, userId: user?.id });

        if (response) {
          dispatch(getPlan());
        } else {
          Alert.alert('Error', 'There was an error updating your day. Please try again.');
        }
      }
      if (action === 'feedback') {
        const response = await call('POST', `users/feedback`, { feedback: value, userId: user?.id });

        if (response) {
          Alert.alert('Thank you', 'Your feedback has been sent.');
        } else {
          Alert.alert('Error', 'There was an error submitting your feedback. Please try again.');
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error sending your message. Please try again.');
    }

    setLoading(false);
    setValue('');
    setVisible(false);
  };

  const handleCancel = () => {
    setLoading(false);
    setVisible(false);
    setValue('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Container>
        <Inner>
          <Input
            multiline
            placeholder={placeholder}
            placeholderTextColor={`${theme.text.colors.secondary}80`}
            value={value}
            onChangeText={(text) => setValue(text)}
          />
          <ButtonRow>
            <CancelButton onPress={handleCancel}>
              <CancelText>Cancel</CancelText>
            </CancelButton>
            <Button onPress={handleAction}>
              {loading ? <ActivityIndicator color="#fff" /> : <SubmitText>Send</SubmitText>}
            </Button>
          </ButtonRow>
        </Inner>
      </Container>
    </Modal>
  );
};

export default ActionModal;
