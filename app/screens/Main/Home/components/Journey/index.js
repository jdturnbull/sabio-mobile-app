import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Modal, useColorScheme, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { debounce } from 'lodash';
import Top from './components/Top';
import { FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from './components/ListItem';
import Separator from './components/Separator';
import Footer from './components/Footer';
import ModalContent from './components/ModalContent';
import { getPlan } from '../../../../../stores/user/userSlice';
import { useMixpanel } from '../../../../../hooks/useMixpanel';
import Up from '../../../../../components/icons/actions/Up';
import Down from '../../../../../components/icons/actions/Down';
import { useTheme } from 'styled-components';

const Journey = ({ setHideButton }) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  const { track } = useMixpanel();

  const colorScheme = 'dark';

  const intervalRef = useRef(null);

  const user = useSelector((state) => state.user?.session?.user);
  const plannedActivities = useSelector((state) => state.user?.plannedActivities);

  const [viewableItems, setViewableItems] = useState([]);
  const [startOfWeekDates, setStartOfWeekDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleIndexs, setVisibleIndexs] = useState([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [modalData, setModalData] = useState();
  const [showPlan, setShowPlan] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    track('USER_ACTION', { action: 'Pull to refresh', screen: 'Home' });

    dispatch(getPlan()).then(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    });
  };

  // Set the start of the week dates for the separators
  useEffect(() => {
    if (!plannedActivities || plannedActivities.length === 0) return;
    const dates = [...new Set(plannedActivities.map((activity) => activity.date))];
    setStartOfWeekDates(dates.filter((date) => moment.utc(date).day() === 0));
  }, [plannedActivities]);

  const onViewableItemsChanged = useCallback(
    debounce(({ viewableItems }) => {
      setViewableItems(viewableItems);
      setVisibleIndexs(viewableItems.map((item) => item.index));
    }, 100),
    [],
  );

  //Get idx of today's date
  const today = moment.tz(user?.timezone).format('YYYY-MM-DD');
  const initIdx = plannedActivities.findIndex((activity) => activity.date === today);

  // Scroll to the current date
  useEffect(() => {
    if (flatListRef.current && initIdx > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: initIdx, animated: true });
      }, 1000);
    }
  }, []);

  const scrollTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };
  const scrollBottom = () => {
    console.log('here');
    let idx = plannedActivities.findIndex((activity) => activity.date === today);

    if (idx < 0) idx = 0;

    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
  };

  // Handle scroll to current date failing
  const handleScrollFailed = ({ index, averageItemLength }) => {
    flatListRef.current?.scrollToOffset({
      offset: index * averageItemLength,
      animated: true,
    });
  };

  // Close the modal when the user scrolls & set the scroll position
  const handleScroll = (event) => {
    if (modalData && !isAutoScrolling) setModalData(null);
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  return (
    <View style={{ flex: 1 }}>
      <Top viewableItems={viewableItems} setShowPlan={setShowPlan} />
      <View
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          top: 130,
          left: 20,
          zIndex: 10000,
        }}>
        <TouchableOpacity style={{ marginBottom: 20 }} onPress={scrollTop}>
          <Up color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={scrollBottom}>
          <Down color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        style={{ marginTop: 4 }}
        contentContainerStyle={{ paddingTop: 35 }}
        data={plannedActivities}
        onScroll={handleScroll}
        onScrollToIndexFailed={handleScrollFailed}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            setModalData={setModalData}
            modalData={modalData}
            index={index}
            setHideButton={setHideButton}
            setIsAutoScrolling={setIsAutoScrolling}
            visibleIndexs={visibleIndexs}
            scrollPosition={scrollPosition}
            ref={flatListRef}
          />
        )}
        windowSize={6}
        ItemSeparatorComponent={(item) => <Separator startOfWeekDates={startOfWeekDates} item={item} />}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Footer data={modalData} setModalData={setModalData} setHideButton={setHideButton} />
      <Modal visible={showPlan} animationType="slide" transparent>
        <ModalContent setShowPlan={setShowPlan} />
      </Modal>
    </View>
  );
};

export default Journey;
