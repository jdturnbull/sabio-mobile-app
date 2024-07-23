import React, { useState } from "react";
import styled from "styled-components";
import SelectableItem from "../../../../components/shared/SelectableItem";
import SubHeader from "../../../../components/shared/SubHeader";
import { ScrollView } from "react-native";
import NextButton from "../../../../components/shared/NextButton";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../../../components/shared/CustomInput";
import { addSchedule } from "../../../../stores/user/userSlice";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Container = styled.View`
    flex: 1;
`;

const NewScheduleModal = ({ closeModal }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [name, setName] = useState('');

    const [trainingDays, setTrainingDays] = useState([]);
    const [longTrainingDay, setLongTrainingDay] = useState(null);


    const handleTrainingDayPress = (day) => {
        if (trainingDays.includes(day)) {
            setTrainingDays((prev) => prev.filter((d) => d !== day));
        } else {
            setTrainingDays((prev) => [...prev, day]);
        }
    };

    const handleCreate = () => {
        const schedule = {
            rest_days: days.filter((d) => !trainingDays.includes(d)),
            long_training_day: longTrainingDay,
            name: name,
        }

        dispatch(addSchedule({ userId: user.id, schedule }));
        closeModal();
    };

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SubHeader style={{ color: '#f8f8f8', marginTop: 10, marginBottom: 15 }}>Name your schedule</SubHeader>
                <CustomInput
                    placeholder="My schedule"
                    value={name}
                    setValue={setName}
                    label="Schedule name"
                    hideLabel
                />
                <SubHeader style={{ color: '#f8f8f8', marginVertical: 20 }}>Select days you'd like to train</SubHeader>
                {days.map((day) => (
                    <SelectableItem key={day} light label={day} selected={trainingDays.includes(day)} onPress={() => handleTrainingDayPress(day)} />
                ))}
                <SubHeader style={{ color: '#f8f8f8', marginVertical: 20 }}>Select a day for longer activities</SubHeader>
                {days.map((day) => (
                    <SelectableItem key={day} light label={day} selected={longTrainingDay === day} onPress={() => setLongTrainingDay(day)} />
                ))}
                <NextButton onPress={handleCreate} text="Create schedule" style={{ marginVertical: 20 }} />
            </ScrollView>
        </Container>
    );
};

export default NewScheduleModal;