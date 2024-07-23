import React, { useState } from "react";
import styled from "styled-components";
import SelectableItem from "../../../../components/shared/SelectableItem";
import SubHeader from "../../../../components/shared/SubHeader";
import { ScrollView } from "react-native";
import NextButton from "../../../../components/shared/NextButton";
import { useDispatch } from "react-redux";
import { updateSchedule, updateActiveSchedule } from "../../../../stores/user/userSlice";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Container = styled(ScrollView)`
    flex: 1;
`;

const ScheduleViewModal = ({ schedule, closeModal }) => {
    const dispatch = useDispatch();
    const [trainingDays, setTrainingDays] = useState(days.filter((d) => !schedule.rest_days.includes(d)));
    const [longTrainingDay, setLongTrainingDay] = useState(schedule.long_training_day);

    const handleUpdate = () => {
        const rest_days = days.filter((d) => !trainingDays.includes(d)).join(',');
        const long_training_day = longTrainingDay;
        const data = { rest_days, long_training_day };

        dispatch(updateSchedule({ scheduleId: schedule.id, data }));
        closeModal();
    }

    const handleLongDayPress = (day) => {
        setLongTrainingDay(day);
    }

    const handleTrainingDayPress = (day) => {
        if (trainingDays.includes(day)) {
            setTrainingDays(trainingDays.filter((d) => d !== day));
        } else {
            setTrainingDays([...trainingDays, day]);
        }
    }

    const handleSetCurrent = () => {
        dispatch(updateActiveSchedule({ scheduleId: schedule.id }));
        closeModal();
    }

    return (
        <Container showsVerticalScrollIndicator={false}>
            {schedule.status !== 'ACTIVE' && <NextButton onPress={handleSetCurrent} text={'Set as current schedule'} style={{ marginVertical: 20 }} />}
            <SubHeader style={{ marginVertical: 20, color: '#f8f8f8' }}>Training days</SubHeader>
            {days.map((day) => (
                <SelectableItem light key={day} label={day} selected={trainingDays.includes(day)} onPress={() => handleTrainingDayPress(day)} />
            ))}
            <SubHeader style={{ marginVertical: 20, color: '#f8f8f8' }}>Long training day</SubHeader>
            {days.map((day) => (
                <SelectableItem light key={day} label={day} selected={longTrainingDay === day} onPress={() => handleLongDayPress(day)} />
            ))}
            <NextButton onPress={handleUpdate} editMode={true} style={{ marginVertical: 20 }} />
        </Container>
    );
};

export default ScheduleViewModal;