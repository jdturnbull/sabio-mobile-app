import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text, Pressable, Modal } from 'react-native';
import moment from 'moment';
import Top from './components/Top';
import { FlatList } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';
import { useSelector } from 'react-redux';
import { hapticImpact } from '../../../../../../utils/haptics';
import { getIconFromLabel } from '../../../../../../utils/icon';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;
const ITEM_HEIGHT = BOX_HEIGHT + 35;
const TOP_HEIGHT = 100;
const TAB_HEIGHT = 95;

const Journey = () => {
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const plannedMonths = useSelector((state) => state.user.plannedMonths);
  const user = useSelector((state) => state.user.session.user);
  const [activeMonth, setActiveMonth] = useState(plannedMonths[0]?.toUpperCase());
  const [startOfWeekDates, setStartOfWeekDates] = useState([]);
  const [visibleIndexs, setVisibleIndexs] = useState([]);
  const [modalDetails, setModalDetails] = useState();
  const [_viewableItems, _setViewableItems] = useState([]);

  const [scrollPosition, setScrollPosition] = useState(0);

  const flatListRef = useRef(null);

  const today = moment.tz(user.timezone).format('YYYY-MM-DD');

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const center = screenWidth / 2 - BOX_WIDTH / 2;

  const initialScrollIndex = plannedActivities.findIndex((activity) => activity.date === today);

  useEffect(() => {
    if (!plannedActivities || plannedActivities.length === 0) return;

    const dates = plannedActivities.map((activity) => activity.date);
    const datesNoDuplicates = [...new Set(dates)];

    setStartOfWeekDates(datesNoDuplicates.filter((date) => moment.utc(date).day() === 0));
  }, [plannedActivities]);

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setVisibleIndexs(viewableItems.map((item) => item.index));

    const firstItem = viewableItems[0].item;
    const date = moment(firstItem.date, 'YYYY-MM-DD');
    const month = date.format('MMMM YYYY');

    if (activeMonth !== month) {
      setActiveMonth(month.toUpperCase());
      hapticImpact();
    }
  }, []);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 10,
  };

  const handleLayout = useCallback(() => {
    setActiveMonth(plannedMonths[0]?.toUpperCase());
  }, []);

  const ListItem = (props) => {
    const { item, index } = props;

    const buttonRef = useRef(null);

    const date = moment.utc(item.date, 'YYYY-MM-DD');

    const Icon =
      item.type === 'unplanned'
        ? getIconFromLabel('unplanned')
        : getIconFromLabel(item.type) || getIconFromLabel('default');

    const TickIcon = getIconFromLabel('completed');

    const arr = date.format('Do').split('');
    const num = arr.length === 3 ? arr[0] : `${arr[0]}${arr[1]}`;
    const label = arr.length === 3 ? `${arr[1]}${arr[2]}` : `${arr[2]}${arr[3]}`;

    const handlePress = () => {
      if (modalDetails?.id === item.id) {
        setModalDetails(null);
        return;
      }

      let positionChange = 0;

      if (index < visibleIndexs[0]) {
        // Item is above the visible items, scroll up
        console.log('Item is above the visible items, scroll up');
        flatListRef.current.scrollToOffset({ offset: scrollPosition - ITEM_HEIGHT, animated: true });
        positionChange = -ITEM_HEIGHT;
      } else if (index > visibleIndexs[visibleIndexs.length - 1]) {
        // Item is below the visible items, scroll down
        console.log('Item is below the visible items, scroll down');
        flatListRef.current.scrollToOffset({ offset: scrollPosition + ITEM_HEIGHT, animated: true });
        positionChange = ITEM_HEIGHT;
      } else if (index === visibleIndexs[visibleIndexs.length - 1]) {
        // Item is the last visible item, scroll down
        console.log('Item is the last visbible item, scroll down');
        flatListRef.current.scrollToOffset({ offset: scrollPosition + ITEM_HEIGHT, animated: true });
        positionChange = ITEM_HEIGHT;
      } else if (index === visibleIndexs[0] && scrollPosition > 99) {
        // Item is the first visible item, scroll up
        console.log('Item is the first visbible item, scroll up');
        flatListRef.current.scrollToOffset({ offset: scrollPosition - ITEM_HEIGHT, animated: true });
        positionChange = -ITEM_HEIGHT;
      }

      const NUM_SEPARATORS = startOfWeekDates.filter((date) => {
        return moment.utc(date).isBefore(item.date);
      }).length;

      console.log(NUM_SEPARATORS);
      console.log(index);

      console.log('Item Number', NUM_SEPARATORS + index + 1);

      let positionY =
        positionChange > 0
          ? (index + NUM_SEPARATORS) * ITEM_HEIGHT
          : positionChange < 0
          ? (index - 1 + NUM_SEPARATORS) * ITEM_HEIGHT
          : (index + 1 + NUM_SEPARATORS) * ITEM_HEIGHT;

      setModalDetails({
        id: item.id,
        index: index,
        completed: item.completed,
        title: item.title,
        planned: item.type !== 'unplanned',
        x: 0,
        y: positionY,
      });
    };

    const handleClickAwayPress = () => {
      if (modalDetails) {
        setModalDetails(null);
      }
    };

    return (
      <Pressable style={{ height: ITEM_HEIGHT }} ref={buttonRef} onPress={handleClickAwayPress}>
        <Pressable onPress={handlePress} style={{ ...styles.pressable, left: item.x + center }}>
          <View style={{ ...styles.box }}>
            <View style={styles.boxBase}>
              <View
                style={{
                  ...styles.boxBase,
                  backgroundColor: item.completed ? '#E66642' : '#8AA1B130',
                  // shadowOffset: {
                  //   width: 3,
                  //   height: 4,
                  // },
                  // shadowRadius: 0,
                  // shadowOpacity: 1,
                  // shadowColor: item.completed ? `#E6664250` : '#8AA1B110',
                }}>
                <View style={styles.boxLeft}>
                  <Icon color={item.completed ? null : '#8AA1B190'} />
                </View>
                <View style={styles.boxRight}>
                  {item.completed ? (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Text style={{ fontFamily: 'Noto Sans', fontWeight: 700, color: '#fff', fontSize: 16 }}>
                        {num}
                        <Text style={{ fontSize: 12 }}>{label}</Text>
                      </Text>
                      <TickIcon />
                    </View>
                  ) : (
                    <Text style={{ fontFamily: 'Noto Sans', fontWeight: 700, color: '#8AA1B190', fontSize: 16 }}>
                      {`${date.format('ddd')} ${num}`}
                      <Text style={{ fontSize: 12 }}>{label}</Text>
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    );
  };

  const Separator = ({ item, index }) => {
    let weekNumber = 0;
    const date = moment.utc(item.leadingItem?.date, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const handleClickAwayPress = () => {
      if (modalDetails) {
        setModalDetails(null);
      }
    };

    if (startOfWeekDates.includes(date)) {
      weekNumber = startOfWeekDates.indexOf(date) + 1;
      const focus = user.weeklyFocuses[`week ${weekNumber}`];

      return (
        <Pressable onPress={handleClickAwayPress} style={styles.separatorContainer}>
          <View style={styles.separatorTop}>
            <View style={styles.separatorDiv} />
            <Text style={styles.separatorTitle}>{`Week ${weekNumber}`}</Text>
            <View style={styles.separatorDiv} />
          </View>
          <View style={styles.separatorBody}>
            <Text style={styles.separatorBodyText}>{focus || ''}</Text>
          </View>
        </Pressable>
      );
    }
  };

  useEffect(() => {
    if (flatListRef.current && initialScrollIndex > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: initialScrollIndex, animated: true });
      }, 1000);
    }
  }, []);

  const handleScroll = (event) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  return (
    <ImageBackground source={background} resizeMode="cover" style={{ flex: 1 }}>
      <Top month={activeMonth} />
      <View style={{ marginTop: 4, marginBottom: TAB_HEIGHT }}>
        {modalDetails && (
          <View
            style={{
              ...styles.pointerBorder,
              top: modalDetails.y,
              borderBottomColor: modalDetails.completed ? '#E66642' : '#8AA1B130',
            }}
          />
        )}
        {modalDetails && (
          <View
            style={{
              ...styles.pointerFill,
              borderBottomColor: modalDetails.completed ? '#E66642' : '#16171B',
              top: modalDetails.y + 3,
            }}
          />
        )}
        {modalDetails && (
          <View
            style={{
              ...styles.callout,
              width: screenWidth - 40,
              top: modalDetails.y + 8,
              backgroundColor: modalDetails.completed ? '#E66642' : '#16171B',
              borderColor: modalDetails.completed ? '#E66642' : '#8AA1B130',
            }}>
            <Text style={styles.modalHeader}>{modalDetails.title}</Text>
          </View>
        )}
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ paddingTop: 35 }}
          onLayout={handleLayout}
          data={plannedActivities}
          onScroll={handleScroll}
          onScrollToIndexFailed={({ index, averageItemLength }) => {
            flatListRef.current?.scrollToOffset({
              offset: index * averageItemLength,
              animated: true,
            });
          }}
          renderItem={(item) => <ListItem {...item} />}
          windowSize={10}
          ItemSeparatorComponent={(item, index) => <Separator item={item} index={index} />}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({
  pressable: {
    height: BOX_HEIGHT,
    marginBottom: 35,
    width: BOX_WIDTH,
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
  },
  boxBase: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16171B',
    borderRadius: 12,
    // shadowOffset: {
    //   width: 3,
    //   height: 4,
    // },
    // shadowRadius: 0,
    // shadowOpacity: 1,
    // shadowColor: '#16171B',
  },
  boxLeft: {
    flex: 0.35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderColor: '#16171B20',
  },
  boxRight: {
    flex: 0.65,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorContainer: {
    width: '100%',
    height: ITEM_HEIGHT,
  },
  separatorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  separatorDiv: {
    width: '30%',
    height: 1,
    backgroundColor: '#8AA1B190',
  },
  separatorTitle: {
    color: '#8AA1B190',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Noto Sans',
  },
  separatorBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  separatorBodyText: {
    color: '#8AA1B170',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: 'Noto Sans',
    textAlign: 'center',
  },
  callout: {
    position: 'absolute',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    zIndex: 1,
    borderWidth: 2,
  },
  pointerBorder: {
    zIndex: 1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12, // Slightly larger for border
    borderRightWidth: 12, // Slightly larger for border
    borderBottomWidth: 11, // Height of the border triangle
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: BOX_HEIGHT,
    alignSelf: 'center',
    position: 'absolute',
    top: BOX_HEIGHT,
  },
  pointerFill: {
    zIndex: 2,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10, // Same width as the pointer border for base
    borderRightWidth: 10, // Same width as the pointer border for base
    borderBottomWidth: 10, // Height of the fill triangle, slightly less than border
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: BOX_HEIGHT + 3, // Position it slightly below the border triangle to fit inside it
    alignSelf: 'center',
  },
});
