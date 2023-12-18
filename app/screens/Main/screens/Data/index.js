import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { View, Pressable, useColorScheme, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { getIconFromLabel } from '../../../../utils/icon';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import call from '../../../../utils/call';
import ProgressReport from './components/ProgressReport';

const defaultReport = {
  fromDate: '2021-01-01',
  toDate: '2021-01-31',
  title: 'Sample Report',
  summary: 'This is a sample report. It is not real data.',
  analysis: {
    distance: 30,
    duration: 300,
    distances: [
      { date: '2021-10-11', value: 3, type: 'run' },
      { date: '2021-10-12', value: 5, type: 'ride' },
      { date: '2021-10-13', value: 2, type: 'run' },
      { date: '2021-10-14', value: 10, type: 'swim' },
      { date: '2021-10-15', value: 2, type: 'run' },
      { date: '2021-10-16', value: 2, type: 'ride' },
      { date: '2021-10-17', value: 6, type: 'swim' },
    ],
    durations: [
      { date: '2021-10-11', value: 100, type: 'run' },
      { date: '2021-10-12', value: 20, type: 'swim' },
      { date: '2021-10-13', value: 40, type: 'swim' },
      { date: '2021-10-14', value: 20, type: 'ride' },
      { date: '2021-10-15', value: 20, type: 'run' },
      { date: '2021-10-16', value: 50, type: 'swim' },
      { date: '2021-10-17', value: 50, type: 'swim' },
    ],
  },
};

const ITEM_HEIGHT = 52;

const Container = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
  background-color: ${(props) => props.theme.colors.settingsBackground};
`;

const HelloContainer = styled.View`
  position: absolute;
  flex-direction: row;
  margin-top: ${(props) => props.theme.spacing.safeAreaView};
  margin-bottom: 10px;
`;

const HelloText = styled.Text`
  flex: 1;
  margin-top: 5px;
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

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

const DataContainer = styled.View`
  position: absolute;
  top: 170px;
  border-radius: 10px;
  width: 100%;
`;

const BlurredBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
`;

const NoReportTitle = styled.Text`
  font-size: 14px;
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.colors.progressDropDownOptionText};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  text-align: center;
`;

const NoReportText = styled.Text`
  font-size: 12px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.colors.progressDropDownOptionText};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  text-align: center;
  margin-top: 10px;
`;

const Data = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user.session.user);

  const rotation = useSharedValue(0);
  const height = useSharedValue(0);

  const [selectedReport, setSelectedReport] = useState({
    title: 'None available',
  });

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  const Down = getIconFromLabel('down');

  useEffect(() => {
    const fetchReports = async () => {
      const response = await call('GET', `users/getProgressReports/${user.id}`);
      setReports(response);
      setLoading(false);
    };
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      setSelectedReport(reports[0]);
    }
  }, [reports]);

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
    <Container>
      <HelloContainer>
        <HelloText>
          My <HelloText style={{ color: theme.colors.primary }}>Progress</HelloText>
        </HelloText>
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
      </HelloContainer>
      <DataContainer>
        {selectedReport?.title !== 'None available' && <ProgressReport report={selectedReport} />}
        {selectedReport?.title === 'None available' && (
          <>
            <ProgressReport report={defaultReport} />
            <BlurredBackground
              blurType={colorScheme === 'light' ? 'light' : 'dark'}
              blurAmount={1}
              style={{ position: 'absolute' }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 20,
                  borderRadius: 20,
                  maxWidth: screenWidth - 40,
                  backgroundColor: colorScheme === 'light' ? '#FFF6D4' : '#272620',
                }}>
                <NoReportTitle>No reports available</NoReportTitle>
                <NoReportText>
                  At the end of each week Sabio will produce a report, drawing insights from your training data
                </NoReportText>
              </View>
            </View>
          </>
        )}
      </DataContainer>
      <View style={{ height: screenHeight, width: screenWidth - 40, justifyContent: 'center', alignItems: 'center' }}>
        {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      </View>
    </Container>
  );
};

export default Data;
