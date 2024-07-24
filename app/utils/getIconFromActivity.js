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

import Run28 from '../assets/icons/28x/Run';
import Lift28 from '../assets/icons/28x/Lift';
import BodyWeightExercises28 from '../assets/icons/28x/BodyWeightExercises';
import Swimming28 from '../assets/icons/28x/Swimming';
import Rest28 from '../assets/icons/28x/Rest';
import Stretch28 from '../assets/icons/28x/Stretch';
import YogaMat28 from '../assets/icons/28x/YogaMat';
import Cycling28 from '../assets/icons/28x/Cycling';
import Treadmill28 from '../assets/icons/28x/Treadmill';
import Elliptical28 from '../assets/icons/28x/Elliptical';
import CoolDown28 from '../assets/icons/28x/CoolDown';
import Walk28 from '../assets/icons/28x/Walk';
import Rowing28 from '../assets/icons/28x/Rowing';
import Default28 from '../assets/icons/28x/Default';

export default (activity, small) => {
    const ICON_MAP_SMALL = {
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

    const ICON_MAP = {
        'run': Run28,
        'jog': Run28,
        'light_run': Run28,
        'sprint': Run28,
        'outdoor_run': Run28,
        'trail_running': Run28,
        'cardio': Run28,
        'strength_training': Lift28,
        'dumbbell': Lift28,
        'weightlifting': Lift28,
        'bodyweight_exercise': BodyWeightExercises28,
        'swimming': Swimming28,
        'rest': Rest28,
        'recovery': Rest28,
        'stretching': Stretch28,
        'mobility': Stretch28,
        'yoga': YogaMat28,
        'foam_rolling': YogaMat28,
        'massage': YogaMat28,
        'meditation': Rest28,
        'cycling': Cycling28,
        'indoor_bike': Cycling28,
        'treadmill': Treadmill28,
        'elliptical': Elliptical28,
        'warm_up': Default28,
        'cool_down': CoolDown28,
        'dynamic_stretching': Stretch28,
        'static_stretching': Stretch28,
        'tabata': Default28,
        'walking': Walk28,
        'hiking': Walk28,
        'rowing_machine': Rowing28,
        'hiit': Default28,
        'interval_training': Default28,
        'breathing_exercise': Default28,
    }

    if (small) return ICON_MAP_SMALL[activity] || Default;
    return ICON_MAP[activity] || Default;
}