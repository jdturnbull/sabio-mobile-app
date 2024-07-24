import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import Plan from '../../../../assets/icons/18x/Course';
import Calendar from '../../../../assets/icons/18x/Calendar';
import Repeat from '../../../../assets/icons/18x/Repeat';
import Edit from '../../../../assets/icons/18x/Edit';
import { useNavigation } from "@react-navigation/native";

const OPTIONS = [{ label: 'Plan Overview', route: 'PlanOverview' }, { label: 'Rearrange Week', route: 'RearrangeWeek' }, { label: 'Adjust Plan', route: 'Main', screen: 'Profile', subScreen: 'View' }, { label: 'Switch Plan', route: 'Account', params: { option: 'Manage your plans' } }];

const ICON_MAP = {
    'Plan Overview': Plan,
    'Rearrange Week': Calendar,
    'Adjust Plan': Edit,
    'Switch Plan': Repeat
}

const Container = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
    padding: 15px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.background2};
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.15;
    shadow-radius: 3.84px;
`;

const Touchable = styled(TouchableOpacity)`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70px;
`;

const IconContainer = styled.View`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.highlight};
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
`;

const TouchableText = styled.Text`
    text-align: center;
    font-size: ${(props) => props.theme.text.size.xs};
     color: ${(props) => props.theme.text.colors.white};
     font-weight: ${(props) => props.theme.text.weight.bold};
`;

const PlanScreenOptions = ({ week }) => {

    const navigation = useNavigation();

    const handlePress = (option) => {
        if (option.route === 'RearrangeWeek') {
            navigation.navigate(option.route, { week });
            return;
        }
        if (option.route === 'Main') {
            if (option.subScreen) {
                navigation.navigate(option.route, { screen: option.screen, params: { screen: option.subScreen } });
            } else {
                navigation.navigate(option.route, { screen: option.screen });
            }
        } else {
            navigation.navigate(option.route, option.params);
        }
    }
    return (
        <Container>
            {OPTIONS.map((option, index) => {
                const Icon = ICON_MAP[option.label];
                return (
                    <Touchable key={index} onPress={() => handlePress(option)}>
                        <IconContainer>
                            <Icon />
                        </IconContainer>
                        <TouchableText>{option.label.split(' ')[0]}</TouchableText>
                        <TouchableText>{option.label.split(' ')[1]}</TouchableText>
                    </Touchable>
                )
            })}
        </Container>
    )
}

export default PlanScreenOptions;