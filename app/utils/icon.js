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
import Strength from '../components/icons/cards/Strength';
import Run from '../components/icons/cards/Run';
import Swim from '../components/icons/cards/Swim';
import Bike from '../components/icons/cards/Bike';
import Rest from '../components/icons/cards/Rest';
import Default from '../components/icons/cards/Default';
import FloatingButton from '../components/icons/home/FloatingButton';
import Analytics from '../components/icons/tabs/Analytics';
import Runner from '../components/icons/general/Runner';
import Bolt from '../components/icons/general/Bolt';

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
  { label: 'strength', icon: Strength },
  { label: 'run', icon: Run },
  { label: 'swim', icon: Swim },
  { label: 'bike', icon: Bike },
  { label: 'rest', icon: Rest },
  { label: 'default', icon: Default },
  { label: 'floatingButton', icon: FloatingButton },
  { label: 'analytics', icon: Analytics },
  { label: 'runner', icon: Runner },
  { label: 'bolt', icon: Bolt },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
