import React, { useState } from "react";
import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity, View, Modal, TextInput, Dimensions, TouchableWithoutFeedback } from "react-native";
import ProfileIcon from '../../../assets/icons/48x/Profile';
import Edit from '../../../assets/icons/18x/Edit';
import { update } from '../../../stores/user/userSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Container = styled.View`
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const NameText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
    color: ${(props) => props.theme.text.colors.white};
    margin-left: 10px;
`;

const ModalContainer = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalContent = styled.View`
    height: 460px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const ModalInput = styled.TextInput`
    color: ${(props) => props.theme.text.colors.white};
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    height: 50px;
    font-size: ${(props) => props.theme.text.size.sm};
    text-align-vertical: ${(props) => (props.multiline ? 'top' : 'center')};
    border: 1px solid ${(props) => props.theme.colors.borderHighlight};
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px;
`;

const ModalButton = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.primary};
    padding: 10px;
    align-items: center;
    border-radius: 5px;
`;

const ModalButtonText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

const Top = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [newUsername, setNewUsername] = useState(user?.username || '');

    const handleEditUsername = () => {
        setModalVisible(true);
    };

    const handleSaveUsername = () => {
        setModalVisible(false);
        setUsername(newUsername);
        dispatch(update({ userId: user.id, data: { username: newUsername } }));
    };

    return (
        <Container>
            <ProfileIcon />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity onPress={handleEditUsername}>
                    <Edit />
                </TouchableOpacity>
                <NameText>{username}</NameText>
            </View>
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <ModalContainer>
                        <TouchableWithoutFeedback>
                            <ModalContent>
                                <ModalInput
                                    value={newUsername}
                                    onChangeText={(text) => {
                                        if (text.length <= 30) {
                                            setNewUsername(text);
                                        }
                                    }}
                                    placeholder="Enter new username"
                                    placeholderTextColor="#888"
                                />
                                <ModalButton onPress={handleSaveUsername}>
                                    <ModalButtonText>Save</ModalButtonText>
                                </ModalButton>
                            </ModalContent>
                        </TouchableWithoutFeedback>
                    </ModalContainer>
                </TouchableWithoutFeedback>
            </Modal>
        </Container>
    )
}

export default Top;