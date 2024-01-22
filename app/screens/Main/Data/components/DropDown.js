import React from 'react';
import styled from 'styled-components';
import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { getIconFromLabel } from '../../../../utils/icon';

const ITEM_HEIGHT = 52;

const DropDownContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 50px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.progressDropDownBackground};
`;

const DropDownText = styled.Text`
  font-size: 10px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-right: 5px;
`;

const OptionBox = styled.Pressable`
  padding: 15px;
`;

const OptionText = styled.Text`
  font-size: 10px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.colors.progressDropDownOptionText};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);

  const Down = getIconFromLabel('down');
  // Animated style for icon rotation
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Animated style for dropdown expansion
  const animatedDropdownStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      width: '100%',
      backgroundColor: theme.colors.progressDropDownBackground,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    };
  });

  const handlePress = () => {
    if (reports.length === 0) return;

    if (open) {
      height.value = withTiming(0, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 }, () => runOnJS(setOpen)(false));
    } else {
      height.value = withTiming(reports.lenth * ITEM_HEIGHT - ITEM_HEIGHT, { duration: 300 }, () =>
        runOnJS(setOpen)(true),
      );

      rotation.value = withTiming(180, { duration: 300 });
    }
  };

  return (
    <View>
      <Pressable onPress={handlePress}>
        <DropDownContainer style={open ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}}>
          <DropDownText>{selectedReport.title}</DropDownText>
          <Animated.View style={animatedIconStyle}>
            <Down />
          </Animated.View>
        </DropDownContainer>
      </Pressable>

      <Animated.View style={animatedDropdownStyle}>
        {reports
          .filter((r) => r.id !== selectedReport.id)
          .map((report, index) => {
            return (
              <OptionBox
                key={index}
                onPress={() => {
                  setSelectedReport(report);
                  setOpen(false);
                  rotation.value = withTiming(0, { duration: 300 });
                  height.value = withTiming(0, { duration: 300 });
                }}>
                <OptionText>{report.title}</OptionText>
              </OptionBox>
            );
          })}
      </Animated.View>
    </View>
  );
};

export default DropDown;
