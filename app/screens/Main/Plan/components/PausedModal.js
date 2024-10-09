import React, { useState } from 'react';
import { View, Modal, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import styled from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Title from '../../../../components/shared/Title';
import SubHeader from '../../../../components/shared/SubHeader';
import CloseIcon from '../../../../assets/icons/24x/Clear';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const ModalInnerContent = styled.View`
    height: ${props => props.height}px;
    width: ${screenWidth - 40}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const DarkenedBackground = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

const ExplainerText = styled.Text``;

const Button = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.white};
    padding: 10px 20px;
    border-radius: 5px;
    margin-top: 20px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const ButtonText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    font-weight: 600;
`;


const PausedModal = ({ modalVisible, setModalVisible }) => {
    const navigation = useNavigation();

    const handleClose = () => {
        setModalVisible(false);
    };

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            handleClose();
        }
    };

    const handleResume = () => {
        setModalVisible(false);
        navigation.navigate('Profile', {
            screen: 'View',
            params: {
                fromPausedModal: true
            }
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler style={{ flex: 1 }} onGestureEvent={handleGesture}>
                    <DarkenedBackground>
                        <ModalInnerContent>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Title>Your plan has been paused</Title>
                                <TouchableOpacity onPress={handleClose}>
                                    <CloseIcon />
                                </TouchableOpacity>
                            </View>
                            <SubHeader>When you're recovered, press below to resume your training</SubHeader>
                            <Button onPress={handleResume}>
                                <ButtonText>Resume training</ButtonText>
                            </Button>
                        </ModalInnerContent>
                    </DarkenedBackground>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </Modal>
    )
}

export default PausedModal;