import React, { forwardRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import moment from 'moment';
import { hapticSelection } from '../../../../../../../utils/haptics';
import { getIconFromLabel } from '../../../../../../../utils/icon';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;
const ITEM_HEIGHT = 95;

const ListItem = forwardRef(
  ({ item, setModalData, modalData, index, visibleIndexs, scrollPosition, setIsAutoScrolling }, ref) => {
    const { width: screenWidth } = Dimensions.get('window');
    const center = screenWidth / 2 - BOX_WIDTH / 2;

    let isSelected = modalData?.id === item.id;

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
      if (item.type === 'unplanned') {
        return;
      }

      if (isSelected) {
        setModalData(null);
        return;
      }

      setIsAutoScrolling(true);

      if (index < visibleIndexs[0]) {
        // Item is above the visible items, scroll up
        ref.current.scrollToOffset({ offset: scrollPosition - ITEM_HEIGHT, animated: true });
      } else if (index > visibleIndexs[visibleIndexs.length - 1]) {
        // Item is below the visible items, scroll down
        ref.current.scrollToOffset({ offset: scrollPosition + ITEM_HEIGHT * 3, animated: true });
      } else if (index === visibleIndexs[visibleIndexs.length - 1]) {
        // Item is the last visible item, scroll down
        ref.current.scrollToOffset({ offset: scrollPosition + ITEM_HEIGHT * 3, animated: true });
      } else if (index === visibleIndexs[0] && scrollPosition > 99) {
        // Item is the first visible item, scroll up
        ref.current.scrollToOffset({ offset: scrollPosition - ITEM_HEIGHT, animated: true });
      }
      setModalData({ id: item.id, item });
      hapticSelection();

      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 1000);
    };

    const handleOverlayPress = () => {
      if (modalData) {
        setModalData(null);
      }
    };

    return (
      <Pressable onPress={handleOverlayPress}>
        <Pressable onPress={handlePress} style={{ ...styles.pressable, left: item.x + center }}>
          <View style={{ ...styles.box }}>
            <View style={styles.boxBase}>
              <View
                style={{
                  ...styles.boxBase,
                  backgroundColor: item.completed ? '#E66642' : isSelected ? '#8AA1B1' : '#8AA1B130',
                  shadowOffset: {
                    width: 3,
                    height: 4,
                  },
                  shadowRadius: 0,
                  shadowOpacity: 1,
                  shadowColor: item.completed ? `#E6664250` : isSelected ? '8AA1B150' : '#8AA1B110',
                }}>
                <View style={styles.boxLeft}>
                  <Icon color={item.completed ? null : isSelected ? '#fff' : '#8AA1B190'} />
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
                    <Text
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 700,
                        color: isSelected ? '#fff' : '#8AA1B190',
                        fontSize: 16,
                      }}>
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
  },
);

export default ListItem;

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
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowColor: '#16171B',
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
});
