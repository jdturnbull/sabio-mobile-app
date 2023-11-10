import { Platform } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

export const hapticImpact = () => Platform.OS === 'ios' && ReactNativeHaptic.generate('impact');
export const hapticImpactHeavy = () => Platform.OS === 'ios' && ReactNativeHaptic.generate('impactHeavy');
export const hapticSelection = () => Platform.OS === 'ios' && ReactNativeHaptic.generate('selection');
