import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import Title from "../../../../../components/shared/Title";
import ArrowLeft from '../../../../../assets/icons/24x/ArrowLeft';
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

import StartScreen from "./components/StartScreen";
import Location from "./components/Location";
import CheckedByProfessional from './components/CheckedByProfessional';
import RangeOfMotion from './components/RangeOfMotion';
import LockedFeeling from './components/LockedFeeling';
import Decision from './components/Decision';

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
`;

const STAGES = ['START', 'LOCATION', 'CHECKED_BY_PROFFESSIONAL', 'RANGE_OF_MOTION', 'LOCKED_FEELING', 'DECISION'];

const Injuries = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);

    const [stage, setStage] = useState("START");
    const opacity = useSharedValue(1);
    const [location, setLocation] = useState(null);
    const [checkedByProfessional, setCheckedByProfessional] = useState(false);
    const [hasFullRangeOfMotion, setHasFullRangeOfMotion] = useState(false);
    const [hasLockedFeeling, setHasLockedFeeling] = useState(false);

    const handleNextStage = (value) => {
        if (stage === 'START') setStage('LOCATION');
        if (stage === 'LOCATION') setStage('CHECKED_BY_PROFFESSIONAL');

        if (stage === 'CHECKED_BY_PROFFESSIONAL') {
            if (value) setStage('DECISION');
            if (!value) setStage('RANGE_OF_MOTION');
        }

        if (stage === 'RANGE_OF_MOTION' && !value) setStage('LOCKED_FEELING');
        if (stage === 'RANGE_OF_MOTION' && value) setStage('DECISION');

        if (stage === 'LOCKED_FEELING') setStage('DECISION');
    }

    const handleNext = (value) => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(handleNextStage)(value);
            opacity.value = withTiming(1, { duration: 300 });
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Report an injury</Title>
            </View>
            <Animated.View style={[{ width: '100%', flex: 1 }, animatedStyle]}>
                {stage === 'START' && <StartScreen handleNext={handleNext} />}
                {stage === 'LOCATION' && <Location handleNext={handleNext} setLocation={setLocation} location={location} />}
                {stage === 'CHECKED_BY_PROFFESSIONAL' && <CheckedByProfessional handleNext={handleNext} setCheckedByProfessional={setCheckedByProfessional} />}
                {stage === 'RANGE_OF_MOTION' && <RangeOfMotion handleNext={handleNext} setHasFullRangeOfMotion={setHasFullRangeOfMotion} />}
                {stage === 'LOCKED_FEELING' && <LockedFeeling handleNext={handleNext} setHasLockedFeeling={setHasLockedFeeling} />}
                {stage === 'DECISION' && <Decision hasLockedFeeling={hasLockedFeeling} hasFullRangeOfMotion={hasFullRangeOfMotion} checkedByProfessional={checkedByProfessional} location={location} />}
            </Animated.View>
        </Container>
    )
}

export default Injuries