import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Modal, Dimensions, ScrollView } from "react-native";
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Title from "../../../../components/shared/Title";
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import { useNavigation } from "@react-navigation/native";
import SubHeader from "../../../../components/shared/SubHeader";
import Add from '../../../../assets/icons/18x/AddOutlined';
import Close from '../../../../assets/icons/18x/Clear';
import ScheduleItem from "../components/ScheduleItem";
import ScheduleViewModal from "../components/ScheduleViewModal";
import NewScheduleModal from "../components/NewScheduleModal";
import Edit from '../../../../assets/icons/18x/Edit';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
`;

const NewButton = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.backgroundLight1};
    border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
    padding: 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const NewButtonText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
`;

const ModalContent = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalInnerContent = styled.View`
    height: ${screenHeight * 0.85}px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: ${(props) => props.theme.colors.background1};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const Schedules = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    const schedules = useSelector((state) => state.user.schedules);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [activeSchedule, setActiveSchedule] = useState([]);
    const [archivedSchedules, setArchivedSchedules] = useState([]);

    useEffect(() => {
        setActiveSchedule(schedules.filter(schedule => schedule.status !== "ARCHIVED")[0]);
        setArchivedSchedules(schedules.filter(schedule => schedule.status === "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    }, [schedules]);

    const handleCloseModal = () => {
        setModalVisible(false);
        setModalContent("");
    };

    const handleNewSchedule = () => {
        setModalContent(<NewScheduleModal closeModal={handleCloseModal} />);
        setModalTitle("Create a new training schedule");
        setModalVisible(true);
    };

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            handleCloseModal();
        }
    };

    const handleSchedulePress = (id) => {
        const schedule = schedules.filter((s) => s.id === id)[0];
        setModalContent(<ScheduleViewModal schedule={schedule} closeModal={handleCloseModal} />);
        setModalTitle(schedule.name);
        setModalVisible(true);
    }

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Training Schedules</Title>
            </View>
            <SubHeader style={{ marginBottom: 20 }}>
                Reorganise your training week by creating and switching between schedules
            </SubHeader>
            <NewButton onPress={handleNewSchedule}>
                <NewButtonText>New schedule</NewButtonText>
                <Add />
            </NewButton>
            <SubHeader style={{ marginVertical: 20, color: '#f8f8f8' }}>Active Schedule</SubHeader>
            <ScrollView>
                <ScheduleItem key={activeSchedule.id} schedule={activeSchedule} onPress={handleSchedulePress} />
                <SubHeader style={{ marginVertical: 20, color: '#f8f8f8' }}>Archived Schedules</SubHeader>
                {archivedSchedules.map((schedule) => (
                    <ScheduleItem key={schedule.id} schedule={schedule} onPress={handleSchedulePress} />
                ))}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <PanGestureHandler onGestureEvent={handleGesture}>
                        <ModalContent>
                            <ModalInnerContent>
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingBottom: 10 }}>
                                    <Title style={{ marginBottom: 0 }}>{modalTitle}</Title>
                                    <TouchableOpacity onPress={handleCloseModal}>
                                        <Close />
                                    </TouchableOpacity>
                                </View>
                                {modalContent}
                            </ModalInnerContent>
                        </ModalContent>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </Modal>
        </Container>
    )
}

export default Schedules