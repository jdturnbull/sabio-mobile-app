import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import { ActivityIndicator } from 'react-native-paper';
import getEvents from '../../utils/getEvents';
import styled from 'styled-components';
import AddRaceButton from '../../components/onboarding/AddRaceButton';
import Title from '../../components/shared/Title';
import SearchBar from '../../components/shared/SearchBar';
import CustomDivider from '../../components/shared/CustomDivider';
import SubHeader from '../../components/shared/SubHeader';
import Add from '../../assets/icons/24x/Add';
import { ScrollView } from 'react-native-gesture-handler';
import EventItem from '../../components/onboarding/EventItem';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

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

const SelectEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

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

  const handleResultPress = (event) => {
    dispatch(
      updateState({
        race: {
          name: event.name,
          date: event.start,
          category: event.description,
          distance: event.type,
        },
      }),
    );

    navigation.navigate('SelectTerrain');
  };

  const handleAddRace = () => {
    navigation.navigate('AddRace');
  };

  return (
    <Container>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Title style={{ marginBottom: 10, marginTop: 10, flex: 1 }}>Find your race</Title>
        <TouchableOpacity onPress={handleAddRace}>
          <Add color={'#EE6E12'} />
        </TouchableOpacity>
      </View>
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
          <AddRaceButton style={{ marginBottom: 12 }} />
          {events.map((event) => (
            <EventItem key={event.id} event={event} onPress={handleResultPress} />
          ))}
        </ScrollView>
      )}
    </Container>
  );
};

export default SelectEvent;
