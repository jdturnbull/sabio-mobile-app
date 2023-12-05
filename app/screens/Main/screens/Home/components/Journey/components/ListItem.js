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
    const CrossIcon = getIconFromLabel('missed');

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

    const baseColor =
      isSelected && item.score === 0 ? '#8AA1B1' : item.type === 'unplanned' ? '#394048' : 'transparent';

    const color =
      item.type === 'unplanned'
        ? '#8AA1B130'
        : item.score > 0 && item.score <= 25
        ? '#953636'
        : item.score > 25 && item.score <= 80
        ? '#C9763A'
        : item.score > 80
        ? '#33674E'
        : '#394048';

    return (
      <Pressable onPress={handleOverlayPress}>
        <Pressable onPress={handlePress} style={{ ...styles.pressable, left: item.x + center }}>
          <View style={{ ...styles.box }}>
            <View style={styles.boxBase}>
              <View
                style={{
                  ...styles.boxBase,
                  backgroundColor: baseColor,
                  zIndex: isSelected ? 2 : 0,
                  shadowColor:
                    item.status === 'MISSED'
                      ? '#95363650'
                      : isSelected
                      ? `${baseColor}50`
                      : item.type === 'unplanned'
                      ? `${baseColor}10`
                      : 'transparent',
                }}>
                <View
                  style={{
                    ...styles.completedSection,
                    width: `${item.score}%`,
                    backgroundColor: color,
                    shadowColor: `${color}50`,
                    borderTopRightRadius: item.score === 100 ? 12 : 0,
                    borderBottomRightRadius: item.score === 100 ? 12 : 0,
                  }}
                />
                <View
                  style={{
                    ...styles.uncompleteSection,
                    width: `${100 - item.score}%`,
                    left: `${item.score}%`,
                    shadowColor: `${color}50`,
                    borderTopLeftRadius: item.score > 0 ? null : 12,
                    borderBottomLeftRadius: item.score > 0 ? null : 12,
                  }}
                />
                <View style={{ ...styles.boxLeft, zIndex: 3 }}>
                  <Icon color={item.completed ? null : isSelected ? '#fff' : '#8AA1B190'} />
                </View>
                <View style={{ ...styles.boxRight, zIndex: 3 }}>
                  {item.score === 100 ? (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Noto Sans',
                          fontWeight: 700,
                          color: item.score === 100 ? '#fff' : '#8AA1B190',
                          fontSize: 16,
                        }}>
                        {num}
                        <Text style={{ fontSize: 12 }}>{label}</Text>
                      </Text>
                      {item.score === 100 ? <TickIcon /> : <CrossIcon />}
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 700,
                        color: isSelected ? '#fff' : item.score > 0 ? '#fff' : '#8AA1B190',
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
  completedSection: {
    position: 'absolute',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 1,
    height: '100%',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  uncompleteSection: {
    position: 'absolute',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1,
    height: '100%',
    backgroundColor: '#394048',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  boxBase: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16171B',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
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
