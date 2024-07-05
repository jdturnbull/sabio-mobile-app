import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Keyboard, Dimensions, Image, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import SwipeDown from '../../assets/icons/32x/SwipeDown';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import { ActivityIndicator, Text } from 'react-native-paper';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import getEvents from '../../utils/getEvents';
import styled from 'styled-components';
import AddRaceButton from '../../components/onboarding/AddRaceButton';
import Title from '../../components/onboarding/Title';
import SearchBar from '../../components/onboarding/SearchBar';
import Location from '../../assets/icons/18x/Location';
import Distance from '../../assets/icons/18x/Course';
import Calendar from '../../assets/icons/18x/Calendar';
import { ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
import EventItem from '../../components/onboarding/EventItem';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import CustomDivider from '../../components/onboarding/CustomDivider';
import SubHeader from '../../components/onboarding/SubHeader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`;

const BlankView = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  height: 70%;
  margin-top: 50px;
  margin-bottom: 30px;
`;

const ModalContent = styled(Animated.View)`
  height: ${() => `${screenHeight - 130}px`};
  background-color: #0f1013;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-color: black;
  shadow-offset: 2px 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  position: absolute;
  bottom: 0;
  width: ${() => `${screenWidth}px`};
`;

const DetailContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const DetailText = styled.Text`
  margin-left: 5px;
  color: #f8f8f8;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.sm};
`;

const TouchableText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.sm};
`;

const modal_height = screenHeight * 0.9;

const SelectEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const city = selectedEvent
    ? selectedEvent.city.charAt(0).toUpperCase() + selectedEvent?.city.slice(1).toLowerCase()
    : null;

  const flag = selectedEvent ? getUnicodeFlagIcon(selectedEvent.country_code) : null;

  const translateY = useSharedValue(modal_height);

  useEffect(() => {
    const run = async () => {
      const country = RNLocalize.getCountry();
      const _events = await getEvents({ country, query: 'Run' });
      setEvents(_events);
      setLoading(false);
    };

    run();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    const results = await getEvents({ query });
    setEvents(results);
    setLoading(false);
  };

  const handleResultPress = (id) => {
    setSelectedEvent(events.filter((e) => e.id === id)[0]);
    setModalVisible(true);
    translateY.value = withTiming(screenHeight * 0.1, { duration: 300 });
  };

  const handleClose = () => {
    translateY.value = withTiming(screenHeight * 0.9, { duration: 300 }, () => {
      runOnJS(setModalVisible)(false);
    });
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (translateY.value > screenHeight * 0.3) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(screenHeight * 0.1);
      }
    },
  });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    paddingBottom: 100,
  }));

  const handleSelectRace = () => {
    dispatch(updateState({ race: selectedEvent }));
    navigation.navigate('RateAbility');
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10, marginTop: 10 }}>Find your race</Title>
      <SubHeader>Search the race you're training for</SubHeader>
      <SearchBar style={{ marginTop: 20, marginBottom: 10 }} onSubmit={handleSearch} />
      <CustomDivider />
      {loading && (
        <BlankView>
          <ActivityIndicator animating={true} size={30} color={'#a1aad350'} />
        </BlankView>
      )}
      {!loading && events.length < 1 && (
        <BlankView style={{ marginTop: 0 }}>
          <AddRaceButton />
        </BlankView>
      )}
      {!loading && events.length > 0 && (
        <ScrollView style={{ marginTop: 0, height: '70%' }} showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <EventItem key={event.id} event={event} onPress={handleResultPress} />
          ))}
          {events.length < 4 && <AddRaceButton />}
        </ScrollView>
      )}
      {modalVisible && (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <ModalContent style={modalStyle}>
            <View style={{ position: 'absolute', left: screenWidth / 2 - 16, top: 10, zIndex: 2000 }}>
              <SwipeDown />
            </View>
            <View style={styles.shadowContainer}>
              <Image source={{ uri: selectedEvent.image_url }} style={styles.image} />
              {/* Top Shadow */}
              <LinearGradient
                colors={['#0f1013', '#0f101390', '#0f101330', '#0f101320', '#0f101310']}
                locations={[0, 0.1, 0.4, 0.6, 0.8]}
                style={[styles.insetShadow, styles.bottomShadow]}
              />
              {/* Left Side Shadow */}
              <LinearGradient
                colors={['#0f1013', '#0f101320', '#0f101330', '#0f101320', '#0f101310']}
                locations={[0, 0.1, 0.2, 0.3, 0.4]}
                style={[styles.insetShadow, styles.leftShadow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              {/* Right Side Shadow */}
              <LinearGradient
                colors={['#0f1013', '#0f101320', '#0f101330', '#0f101320', '#0f101310']}
                locations={[0, 0.1, 0.2, 0.3, 0.4]}
                style={[styles.insetShadow, styles.rightShadow]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
              />
              {/* Bottom Shadow */}
              <LinearGradient
                colors={['#0f1013', '#0f101390', '#0f101330', '#0f101320', '#0f101310']}
                locations={[0, 0.1, 0.2, 0.3, 0.4]}
                style={[styles.insetShadow, styles.rightShadow]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
            </View>
            <View style={{ flex: 1, marginTop: 160, paddingHorizontal: 20 }}>
              <Title style={{ fontSize: 20 }}>{selectedEvent.name}</Title>
              <DetailContainer>
                <Distance color={'#A1AAD3'} />
                <DetailText>{selectedEvent.type}</DetailText>
              </DetailContainer>
              <DetailContainer>
                <Calendar color={'#A1AAD3'} />
                <DetailText>{moment(selectedEvent.start).format('ddd, D MMM YYYY')}</DetailText>
              </DetailContainer>
              <DetailContainer>
                <Location color={'#A1AAD3'} />
                <DetailText>{`${city}, ${selectedEvent.country}  ${flag}`}</DetailText>
              </DetailContainer>
              <RenderHtml
                baseStyle={{ color: '#f8f8f8' }}
                enableExperimentalMarginCollapsing={true}
                contentWidth={screenWidth}
                source={{ html: `<p>${selectedEvent.description.split('</p>')[0]}</p>` }}
              />
              <TouchableOpacity
                onPress={handleSelectRace}
                style={{
                  position: 'absolute',
                  width: screenWidth - 40,
                  margin: 'auto',
                  bottom: 20,
                  left: 20,
                  backgroundColor: '#f8f8f8',
                  padding: 10,
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableText>Select Race</TouchableText>
              </TouchableOpacity>
            </View>
          </ModalContent>
        </PanGestureHandler>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowContainer: {
    position: 'absolute',
    height: 150,
    width: screenWidth,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    overflow: 'hidden', // Ensure the shadow does not exceed the container
  },
  image: {
    height: '100%',
    width: '100%',
    opacity: 0.7,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  insetShadow: {
    position: 'absolute',
  },
  bottomShadow: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%', // Adjust as needed to control the shadow height
  },
  leftShadow: {
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%', // Adjust as needed to control the shadow width
  },
  rightShadow: {
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%', // Adjust as needed to control the shadow width
  },
});

export default SelectEvent;
