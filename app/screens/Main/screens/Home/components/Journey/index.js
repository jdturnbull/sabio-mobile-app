import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ImageBackground, Modal } from 'react-native';
import moment from 'moment';
import { debounce } from 'lodash';
import Top from './components/Top';
import { FlatList } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';
import { useSelector } from 'react-redux';
import ListItem from './components/ListItem';
import Separator from './components/Separator';
import Footer from './components/Footer';
import ModalContent from './components/ModalContent';

const Journey = () => {
  const flatListRef = useRef(null);

  const user = useSelector((state) => state.user.session.user);
  const plannedActivities = useSelector((state) => state.user.plannedActivities);

  const [viewableItems, setViewableItems] = useState([]);
  const [startOfWeekDates, setStartOfWeekDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleIndexs, setVisibleIndexs] = useState([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [modalData, setModalData] = useState();
  const [showPlan, setShowPlan] = useState(false);

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
  const today = moment.tz(user.timezone).format('YYYY-MM-DD');
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
    <ImageBackground source={background} resizeMode="cover" style={{ flex: 1 }}>
      <Top viewableItems={viewableItems} setShowPlan={setShowPlan} />
      <FlatList
        onTouchStart={() => setModalData(null)}
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
            setIsAutoScrolling={setIsAutoScrolling}
            visibleIndexs={visibleIndexs}
            scrollPosition={scrollPosition}
            ref={flatListRef}
          />
        )}
        windowSize={10}
        ItemSeparatorComponent={(item) => <Separator startOfWeekDates={startOfWeekDates} item={item} />}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      <Footer data={modalData} />
      <Modal visible={showPlan} animationType="slide" transparent>
        <ModalContent setShowPlan={setShowPlan} />
      </Modal>
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({});
