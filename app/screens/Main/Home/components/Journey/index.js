import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import moment from 'moment';
import { debounce } from 'lodash';
import Top from './components/Top';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from './components/ListItem';
import Separator from './components/Separator';
import Footer from './components/Footer';
import ModalContent from './components/ModalContent';
import { getPlan } from '../../../../../stores/user/userSlice';
import { useMixpanel } from '../../../../../hooks/useMixpanel';
import call from '../../../../../utils/call';

const Journey = ({ setHideButton }) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  const { track } = useMixpanel();

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
