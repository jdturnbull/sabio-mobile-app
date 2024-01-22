import React, { forwardRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { Pressable, Dimensions } from 'react-native';
import moment from 'moment';
import { hapticSelection } from '../../../../../../utils/haptics';
import { getIconFromLabel } from '../../../../../../utils/icon';

const BOX_WIDTH = 164;
const BOX_HEIGHT = 60;
const ITEM_HEIGHT = 95;

// Left will be the completed colour
const LeftBackground = styled.View`
  height: 100%;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  align-self: flex-start;
`;
// Right will be the pending colour
const RightBackground = styled.View`
  height: 100%;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  align-self: flex-end;
`;

const Content = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
`;

const ContentText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.secondaryInverse};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const ListItem = forwardRef(
  ({ item, setModalData, modalData, index, visibleIndexs, scrollPosition, setIsAutoScrolling }, ref) => {
    const { width: screenWidth } = Dimensions.get('window');
    const center = screenWidth / 2 - BOX_WIDTH / 2;

    const theme = useTheme();

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
    const day = item.status === 'PENDING' || item.type === 'unplanned' ? date.format('ddd') : '';

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

    const borderColor =
      item.status === 'PENDING' || item.type === 'unplanned'
        ? theme.home.cards.borderColorPending
        : item.status === 'MISSED'
        ? theme.home.cards.borderColorMissed
        : theme.home.cards.borderColorCompleted;

    const leftBackgroundColor =
      item.score > 0 && item.score <= 25
        ? theme.home.cards.leftBackgroundSmall
        : item.score > 25 && item.score <= 70
        ? theme.home.cards.leftBackgroundPartial
        : item.score >= 70
        ? theme.home.cards.leftBackgroundFull
        : null;

    const rightBackgroundColor = item.status === 'MISSED' ? 'transparent' : theme.home.cards.rightBackground;

    const iconColor =
      item.status === 'MISSED'
        ? theme.home.cards.iconMissedColor
        : item.score > 0
        ? theme.home.cards.iconCompletedColor
        : theme.home.cards.iconPendingColor;

    return (
      <Pressable onPress={handleOverlayPress}>
        <Pressable
          onPress={handlePress}
          style={{
            height: BOX_HEIGHT,
            width: BOX_WIDTH,
            marginBottom: 35,
            padding: 0,
            margin: 0,
            left: item.x + center,
            borderWidth: 2,
            borderColor,
            borderRadius: 18,
            flexDirection: 'row',
          }}>
          <LeftBackground
            style={[
              item.score === 100 && { borderRadius: 16 },
              { width: `${item.score}%`, backgroundColor: leftBackgroundColor },
            ]}
          />
          <RightBackground
            style={[
              item.score === 0 || item.type === 'unplanned' ? { borderRadius: 16 } : null,
              item.type === 'unplanned' ? { width: '100%' } : { width: `${100 - item.score}%` },
              { backgroundColor: rightBackgroundColor },
            ]}
          />
          <Content>
            <Icon color={iconColor} />
            <ContentText
              style={
                item.status === 'MISSED'
                  ? { color: theme.home.cards.missedTextColor }
                  : item.status === 'PENDING' || item.type === 'unplanned'
                  ? { color: theme.home.cards.inCompleteTextColor }
                  : null
              }>{`${day} ${num}${label}`}</ContentText>
            {item.status === 'COMPLETED' || item.status === 'PART_COMPLETED' ? <TickIcon color={iconColor} /> : null}
            {item.status === 'MISSED' && <CrossIcon color={iconColor} />}
          </Content>
        </Pressable>
      </Pressable>
    );
  },
);

export default ListItem;
