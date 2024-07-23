import Run from '../assets/icons/18x/Run';
import Lift from '../assets/icons/18x/Lift';
import BodyWeightExercises from '../assets/icons/18x/BodyWeightExercises';
import Swimming from '../assets/icons/18x/Swimming';
import Rest from '../assets/icons/18x/Rest';
import Stretch from '../assets/icons/18x/Stretch';
import YogaMat from '../assets/icons/18x/YogaMat';
import Cycling from '../assets/icons/18x/Cycling';
import Treadmill from '../assets/icons/18x/Treadmill';
import Elliptical from '../assets/icons/18x/Elliptical';
import CoolDown from '../assets/icons/18x/CoolDown';
import Walk from '../assets/icons/18x/Walk';
import Rowing from '../assets/icons/18x/Rowing';
import Default from '../assets/icons/18x/Default';

export default (activity) => {
    const ICON_MAP = {
        'run': Run,
        'jog': Run,
        'light_run': Run,
        'sprint': Run,
        'outdoor_run': Run,
        'trail_running': Run,
        'cardio': Run,
        'strength_training': Lift,
        'dumbbell': Lift,
        'weightlifting': Lift,
        'bodyweight_exercise': BodyWeightExercises,
        'swimming': Swimming,
        'rest': Rest,
        'recovery': Rest,
        'stretching': Stretch,
        'mobility': Stretch,
        'yoga': YogaMat,
        'foam_rolling': YogaMat,
        'massage': YogaMat,
        'meditation': Rest,
        'cycling': Cycling,
        'indoor_bike': Cycling,
        'treadmill': Treadmill,
        'elliptical': Elliptical,
        'warm_up': Default,
        'cool_down': CoolDown,
        'dynamic_stretching': Stretch,
        'static_stretching': Stretch,
        'tabata': Default,
        'walking': Walk,
        'hiking': Walk,
        'rowing_machine': Rowing,
        'hiit': Default,
        'interval_training': Default,
        'breathing_exercise': Default,
    }

    return ICON_MAP[activity] || Default;
}