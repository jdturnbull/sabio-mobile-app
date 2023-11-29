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
import DefaultSmall from '../components/icons/cards/DefaultSmall';
import FloatingButton from '../components/icons/home/FloatingButton';
import Analytics from '../components/icons/tabs/Analytics';
import Runner from '../components/icons/general/Runner';
import Bolt from '../components/icons/general/Bolt';
import Yoga from '../components/icons/cards/Yoga';
import Next from '../components/icons/general/Next';
import Create from '../components/icons/actions/Create';
import Delete from '../components/icons/actions/Delete';
import Update from '../components/icons/actions/Update';
import Completed from '../components/icons/cards/Completed';
import RunSmall from '../components/icons/cards/RunSmall';
import BikeSmall from '../components/icons/cards/BikeSmall';
import SwimSmall from '../components/icons/cards/SwimSmall';
import StrengthSmall from '../components/icons/cards/StrengthSmall';
import ViewAnalysis from '../components/icons/cards/View';
import Help from '../components/icons/general/Help';
import Confidence from '../components/icons/general/Confidence';
import Read from '../components/icons/general/Read';
import Streak from '../components/icons/general/Streak';

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
  { label: 'run', icon: Run },
  { label: 'swim', icon: Swim },
  { label: 'bike', icon: Bike },
  { label: 'rest', icon: Rest },
  { label: 'strength', icon: Strength },
  { label: 'floatingButton', icon: FloatingButton },
  { label: 'analytics', icon: Analytics },
  { label: 'runner', icon: Runner },
  { label: 'bolt', icon: Bolt },
  { label: 'yoga', icon: Yoga },
  { label: 'default', icon: Default },
  { label: 'next', icon: Next },
  { label: 'create', icon: Create },
  { label: 'delete', icon: Delete },
  { label: 'update', icon: Update },
  { label: 'completed', icon: Completed },
  { label: 'defaultsmall', icon: DefaultSmall },
  { label: 'runsmall', icon: RunSmall },
  { label: 'viewAnalysis', icon: ViewAnalysis },
  { label: 'bikesmall', icon: BikeSmall },
  { label: 'strengthsmall', icon: StrengthSmall },
  { label: 'swimsmall', icon: SwimSmall },
  { label: 'help', icon: Help },
  { label: 'streak', icon: Streak },
  { label: 'confidence', icon: Confidence },
  { label: 'read', icon: Read },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
