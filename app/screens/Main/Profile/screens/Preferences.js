import React, { useState, useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, TextInput, Alert, Text } from "react-native";
import styled from 'styled-components';
import EditableOption from "../components/EditableOption";
import { useDispatch, useSelector } from "react-redux";
import Add from '../../../../assets/icons/18x/AddOutlined';
import Title from "../../../../components/shared/Title";
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import { useNavigation } from "@react-navigation/native";
import Return from '../../../../assets/icons/18x/Return'
import { addPreference, updatePreference } from "../../../../stores/user/userSlice";
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

const Preferences = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const _preferences = useSelector((state) => state.user.preferences);
    const [preferences, setPreferences] = useState(_preferences.filter(preference => preference.status !== "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    const [archivedPreferences, setArchivedPreferences] = useState(_preferences.filter(preference => preference.status === "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    const [showArchived, setShowArchived] = useState(false);
    const inputRef = useRef(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const user = useSelector((state) => state.user.user);

    const [showInput, setShowInput] = useState(false);
    const [newPreference, setNewPreference] = useState("");

    useEffect(() => {
        // This doesn't seem to cause a rerender when new preferences are added
        setPreferences(_preferences.filter(preference => preference.status !== "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
        setArchivedPreferences(_preferences.filter(preference => preference.status === "ARCHIVED").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    }, [_preferences]);

    const handleAddPreference = () => {
        setShowInput(!showInput);
        if (!showInput) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handlePreferenceSubmit = () => {
        console.log('here')
        Alert.alert(
            'Confirm',
            'This may change your future activities',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        dispatch(addPreference({ userId: user.id, preference: newPreference }));
                        setNewPreference("");
                        setShowInput(false);
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const handleArchive = (preferenceId) => {
        Alert.alert(
            'Confirm',
            'This will archive the preference and may change your plan',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        dispatch(updatePreference({ preferenceId, data: { status: "ARCHIVED" } }));
                        setPreferences(preferences.filter(preference => preference.id !== preferenceId));
                        setArchivedPreferences([...archivedPreferences, _preferences.find(preference => preference.id === preferenceId)]);
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const handleRestore = (preferenceId) => {
        Alert.alert(
            'Confirm',
            'This will restore the preference and may change your plan',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        dispatch(updatePreference({ preferenceId, data: { status: "ACTIVE" } }));
                        setArchivedPreferences(archivedPreferences.filter(preference => preference.id !== preferenceId));
                        setPreferences([...preferences, _preferences.find(preference => preference.id === preferenceId)]);
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Training Preferences</Title>
            </View>
            <SubHeader style={{ marginBottom: 20 }}>Changes to preferences update your plan, swipe a preference to remove it</SubHeader>
            <SubHeader style={{ marginBottom: 20 }}>Example: <Text style={{ fontStyle: 'italic' }}>I prefer to run on treadmills</Text></SubHeader>
            <NewButton onPress={handleAddPreference}>
                {showInput ? (
                    <StyledInput
                        ref={inputRef}
                        placeholder="Press enter to submit"
                        placeholderTextColor="#999"
                        value={newPreference}
                        onChangeText={setNewPreference}
                        onSubmitEditing={handlePreferenceSubmit}
                        keyboardAppearance="dark"
                        blurOnSubmit={true}
                    />
                ) : (
                    <NewButtonText>Add new</NewButtonText>
                )}
                {showInput ? <Return color={'#999'} /> : <Add color={'#f8f8f8'} />}
            </NewButton>
            <Scrollable>
                {preferences.map((preference, i) => <EditableOption key={i} item={preference} label={preference.description} handleSwipe={handleArchive} />)}
                <TouchableOpacity onPress={() => setShowArchived(!showArchived)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <SubHeader style={{ marginRight: 5, color: '#f8f8f8' }}>Archived Preferences</SubHeader>
                    {showArchived ? <ArrowUp color={'#f8f8f890'} /> : <ArrowDown color={'#f8f8f890'} />}
                </TouchableOpacity>
                {showArchived && archivedPreferences.map((preference, i) => <EditableOption key={i} item={preference} label={preference.description} handleSwipe={handleRestore} />)}
            </Scrollable>
        </Container>
    )
}

export default Preferences