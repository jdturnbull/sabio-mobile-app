import { createRef } from 'react';
import { CommonActions } from '@react-navigation/native';

export const navigationRef = createRef();
export const navigateRoot = (name, params) => {
  navigationRef.current?.dispatch(CommonActions.navigate({ name, params }));
};
export const resetRoot = (opts) => navigationRef.current?.dispatch(CommonActions.reset(opts));

export default { navigationRef, navigateRoot, resetRoot };
