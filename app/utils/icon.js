import LogoLarge from '../components/icons/company/logoLarge';
import LogoSmall from '../components/icons/company/logoSmall';
import LogoMedium from '../components/icons/company/logoMedium';
import Apple from '../components/icons/brands/Apple';
import Garmin from '../components/icons/brands/Garmin';
import Fitbit from '../components/icons/brands/Fitbit';
import Strava from '../components/icons/brands/Strava';
import Stop from '../components/icons/general/Stop';
import Send from '../components/icons/general/Send';
import Back from '../components/icons/general/Back';
import AppleWhite from '../components/icons/brands/AppleWhite';
import Home from '../components/icons/tabs/Home';
import Feed from '../components/icons/tabs/Feed';
import Chat from '../components/icons/tabs/Chat';
import Settings from '../components/icons/tabs/Settings';

export const ICONS = [
  { label: 'logoLarge', icon: LogoLarge },
  { label: 'apple', icon: Apple },
  { label: 'garmin', icon: Garmin },
  { label: 'fitbit', icon: Fitbit },
  { label: 'strava', icon: Strava },
  { label: 'stop', icon: Stop },
  { label: 'logoSmall', icon: LogoSmall },
  { label: 'send', icon: Send },
  { label: 'logoMedium', icon: LogoMedium },
  { label: 'back', icon: Back },
  { label: 'appleWhite', icon: AppleWhite },
  { label: 'home', icon: Home },
  { label: 'feed', icon: Feed },
  { label: 'chat', icon: Chat },
  { label: 'settings', icon: Settings },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
