import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { getIconFromLabel } from '../../../../../../../utils/icon';
import { ScrollView } from 'react-native-gesture-handler';
import call from '../../../../../../../utils/call';
import { useDispatch } from 'react-redux';
import { getPlan } from '../../../../../../../stores/user/userSlice';
import { useMixpanel } from '../../../../../../../hooks/useMixpanel';

const Container = styled.View``;

const Label = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.colors.labelColor};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  margin-bottom: 15px;
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const EditBox = styled.TextInput`
  background-color: ${(props) => props.theme.editScreen.inputBackground};
  color: ${(props) => props.theme.text.colors.secondary};
  padding: 15px;
  border-radius: 10px;
  margin: 10px 0;
`;

const TypeBox = styled.Pressable`
  padding: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.editScreen.inputBackground};
  border-radius: 10px;
`;

const TypeText = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.secondary};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-left: 10px;
  flex: 1;
`;

const DotCircleBorder = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${(props) => props.theme.editScreen.offsetColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.View`
  height: 12px;
  width: 12px;
  background-color: ${(props) => props.theme.editScreen.offsetColor};
  border-radius: 6.5px;
`;

const SaveButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 18px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const SaveText = styled.Text`
  margin-right: 10px;
  color: #fff;
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
`;

const EditScreen = ({ item, handleEditPress }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { track } = useMixpanel();

  useEffect(() => {
    track('SCREEN_VIEW', { screen: 'Edit activity' });
  }, []);

  const types = [
    { id: 'swim', label: 'Swim' },
    { id: 'ride', label: 'Ride' },
    { id: 'run', label: 'Run' },
    { id: 'stretch', label: 'Stretch' },
    { id: 'strength', label: 'Strength' },
    { id: 'rest', label: 'Rest' },
    { id: 'brick', label: 'Brick' },
    { id: 'custom', label: 'Custom' },
  ];

  const [title, setTitle] = useState(item?.title);
  const [type, setType] = useState(item?.type);
  const [guidance, setGuidance] = useState(item?.guidance);

  const handleSave = async () => {
    const resp = await call('POST', 'users/updatePlannedActivity', {
      id: item.id,
      data: {
        title,
        type,
        guidance,
      },
    });
    if (resp) {
      track('USER_ACTION', { action: 'Edit Planned Activity', screen: 'Edit activity', activity: item.id });
      dispatch(getPlan());
      handleEditPress();
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Label style={{ marginTop: 20 }}>Rename title</Label>
        <EditBox value={title} onChangeText={setTitle} />
        <Label style={{ marginTop: 15 }}>Select type of workout</Label>

        {types.map((t) => {
          const selected = type === t.id;
          const Icon = getIconFromLabel(t.id);

          return (
            <TypeBox key={t.id} onPress={() => setType(t.id)}>
              <Icon color={theme.editScreen.offsetColor} />
              <TypeText>{t.label}</TypeText>
              <DotCircleBorder>{selected && <Dot />}</DotCircleBorder>
            </TypeBox>
          );
        })}

        <Label style={{ marginTop: 15 }}>Description</Label>
        <EditBox multiline={true} value={guidance} onChangeText={setGuidance} />
        <SaveButton onPress={handleSave}>
          <SaveText>Save</SaveText>
        </SaveButton>
        <View style={{ height: 40 }} />
      </ScrollView>
    </Container>
  );
};

export default EditScreen;
