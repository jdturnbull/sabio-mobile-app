import React, { useState, useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, TextInput } from "react-native";
import styled from 'styled-components';
import EditableOption from "../components/EditableOption";
import { useDispatch, useSelector } from "react-redux";
import Add from '../../../../assets/icons/18x/AddOutlined';
import Title from "../../../../components/shared/Title";
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import { useNavigation } from "@react-navigation/native";
import Return from '../../../../assets/icons/18x/Return'
import { addMedication, updateMedication } from "../../../../stores/user/userSlice";
import SubHeader from "../../../../components/shared/SubHeader";
import ArrowDown from '../../../../assets/icons/18x/ArrowDown';
import ArrowUp from '../../../../assets/icons/18x/ArrowUp';

const Container = styled.View`
flex: 1;
background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
`;

const Scrollable = styled(ScrollView)`
flex: 1;
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

const StyledInput = styled(TextInput)`
    color: ${(props) => props.theme.text.colors.white};
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.md};
    flex: 1;
`;

const Medications = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const _medications = useSelector((state) => state.user.medications);

    const [medications, setMedications] = useState(_medications.filter(medication => medication.status !== "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    const [archivedMedications, setArchivedMedications] = useState(_medications.filter(medication => medication.status === "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    const [showArchived, setShowArchived] = useState(false);
    const inputRef = useRef(null);

    const user = useSelector((state) => state.user.user);

    const [showInput, setShowInput] = useState(false);
    const [newMedication, setNewMedication] = useState("");

    useEffect(() => {
        setMedications(_medications.filter(medication => medication.status !== "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
        setArchivedMedications(_medications.filter(medication => medication.status === "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    }, [_medications]);

    const handleAddMedication = () => {
        setShowInput(!showInput);
        if (!showInput) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handleMedicationSubmit = () => {
        dispatch(addMedication({ userId: user.id, medication: newMedication }));
        setNewMedication("");
        setShowInput(false);
    }

    const handleArchive = (medicationId) => {
        dispatch(updateMedication({ medicationId, data: { status: "ARCHIVED" } }));
        setMedications(medications.filter(medication => medication.id !== medicationId));
        setArchivedMedications([...archivedMedications, _medications.find(medication => medication.id === medicationId)]);
    }

    const handleRestore = (medicationId) => {
        dispatch(updateMedication({ medicationId, data: { status: "ACTIVE" } }));
        setArchivedMedications(archivedMedications.filter(medication => medication.id !== medicationId));
        setMedications([...medications, _medications.find(medication => medication.id === medicationId)]);
    }

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Current Medications</Title>
            </View>
            <SubHeader style={{ marginBottom: 20 }}>Changes to medications update your plan, swipe a medication to remove it</SubHeader>
            <NewButton onPress={handleAddMedication}>
                {showInput ? (
                    <StyledInput
                        ref={inputRef}
                        placeholder="Press enter to submit"
                        placeholderTextColor="#999"
                        value={newMedication}
                        onChangeText={setNewMedication}
                        onSubmitEditing={handleMedicationSubmit}
                    />
                ) : (
                    <NewButtonText>Add new</NewButtonText>
                )}
                {showInput ? <Return /> : <Add />}
            </NewButton>
            <Scrollable>
                {medications.map((medication, i) => <EditableOption key={i} item={medication} label={medication.description} handleSwipe={handleArchive} />)}
                <TouchableOpacity onPress={() => setShowArchived(!showArchived)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <SubHeader style={{ marginRight: 5, color: '#f8f8f8' }}>Archived Medications</SubHeader>
                    {showArchived ? <ArrowUp color={'#f8f8f890'} /> : <ArrowDown color={'#f8f8f890'} />}
                </TouchableOpacity>
                {showArchived && archivedMedications.map((medication, i) => <EditableOption key={i} item={medication} label={medication.description} handleSwipe={handleRestore} />)}
            </Scrollable>
        </Container>
    )
}

export default Medications