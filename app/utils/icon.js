import LogoLarge from '../components/icons/company/LogoLarge';
import LogoSmall from '../components/icons/company/LogoSmall';
import LogoMedium from '../components/icons/company/LogoMedium';
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
import Unknown from '../components/icons/cards/Unknown';
import Yoga from '../components/icons/cards/Yoga';
import Completed from '../components/icons/cards/Completed';
import Missed from '../components/icons/cards/Missed';
import Stretch from '../components/icons/cards/Stretch';
import Brick from '../components/icons/cards/Brick';

import FloatingButton from '../components/icons/home/FloatingButton';
import Analytics from '../components/icons/tabs/Analytics';
import Runner from '../components/icons/general/Runner';
import Bolt from '../components/icons/general/Bolt';
import Next from '../components/icons/general/Next';
import Create from '../components/icons/actions/Create';
import Delete from '../components/icons/actions/Delete';
import Update from '../components/icons/actions/Update';
import ViewAnalysis from '../components/icons/cards/View';
import Help from '../components/icons/general/Help';
import Confidence from '../components/icons/general/Confidence';
import Read from '../components/icons/general/Read';
import Streak from '../components/icons/general/Streak';
import LandingRunner from '../components/icons/general/LandingRunner';
import LandingMidGraphic from '../components/icons/general/LandingMidGraphic';
import LandingMidGraphicDark from '../components/icons/general/LandingMidGraphicDark';
import New from '../components/icons/general/New';
import Subscribe from '../components/icons/general/Subscribe';
import Support from '../components/icons/general/Support';
import Connection from '../components/icons/general/Connection';
import Down from '../components/icons/general/Down';
import Up from '../components/icons/general/Up';
import Profile from '../components/icons/general/Profile';

import SabioGreyedLight from '../components/icons/company/SabioGreyedLight';
import SabioGreyedDark from '../components/icons/company/SabioGreyedDark';
import SabioSmall from '../components/icons/company/SabioSmall';
import WaitingLight from '../components/icons/company/WaitingLight';
import WaitingDark from '../components/icons/company/WaitingDark';
import SplashWhite from '../components/icons/company/SplashLight';
import SplashDark from '../components/icons/company/SplashDark';

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
  { label: 'walk', icon: Run },
  { label: 'swim', icon: Swim },
  { label: 'bike', icon: Bike },
  { label: 'ride', icon: Bike },
  { label: 'brick', icon: Brick },
  { label: 'rest', icon: Rest },
  { label: 'strength', icon: Strength },
  { label: 'weighttraining', icon: Strength },
  { label: 'default', icon: Default },
  { label: 'yoga', icon: Yoga },
  { label: 'completed', icon: Completed },
  { label: 'floatingButton', icon: FloatingButton },
  { label: 'analytics', icon: Analytics },
  { label: 'runner', icon: Runner },
  { label: 'bolt', icon: Bolt },
  { label: 'next', icon: Next },
  { label: 'create', icon: Create },
  { label: 'delete', icon: Delete },
  { label: 'update', icon: Update },
  { label: 'viewAnalysis', icon: ViewAnalysis },
  { label: 'help', icon: Help },
  { label: 'streak', icon: Streak },
  { label: 'confidence', icon: Confidence },
  { label: 'read', icon: Read },
  { label: 'unplanned', icon: Unknown },
  { label: 'missed', icon: Missed },
  { label: 'stretch', icon: Stretch },
  { label: 'landingRunner', icon: LandingRunner },
  { label: 'landingMidGraphic', icon: LandingMidGraphic },
  { label: 'landingMidGraphicDark', icon: LandingMidGraphicDark },
  { label: 'new', icon: New },
  { label: 'support', icon: Support },
  { label: 'subscribe', icon: Subscribe },
  { label: 'connection', icon: Connection },
  { label: 'down', icon: Down },
  { label: 'up', icon: Up },
  { label: 'sabioGreyedLight', icon: SabioGreyedLight },
  { label: 'sabioGreyedDark', icon: SabioGreyedDark },
  { label: 'sabioSmall', icon: SabioSmall },
  { label: 'profile', icon: Profile },
  { label: 'waitingLight', icon: WaitingLight },
  { label: 'waitingDark', icon: WaitingDark },
  { label: 'splashWhite', icon: SplashWhite },
  { label: 'splashDark', icon: SplashDark },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
