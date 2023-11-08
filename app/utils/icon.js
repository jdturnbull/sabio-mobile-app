import LogoLarge from '../components/icons/company/logoLarge';
import Apple from '../components/icons/brands/Apple';
import Garmin from '../components/icons/brands/Garmin';
import Fitbit from '../components/icons/brands/Fitbit';
import Strava from '../components/icons/brands/Strava';
import Stop from '../components/icons/general/Stop';

export const ICONS = [
  { label: 'LogoLarge', icon: LogoLarge },
  { label: 'apple', icon: Apple },
  { label: 'garmin', icon: Garmin },
  { label: 'fitbit', icon: Fitbit },
  { label: 'strava', icon: Strava },
  { label: 'stop', icon: Stop },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
