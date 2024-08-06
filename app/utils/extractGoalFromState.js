export default (state) => {
    if (state.customGoal) {
        return state.customGoal.goal;
    }

    if (state.race) {
        return `They will participate in an upcoming race, race data: ${JSON.stringify(state.race)}`
    }

    if (state.runDistance) {
        return `Run ${state.runDistance.distance} on ${state.runDistance.terrain} terrain`;
    }

    if (state.generalHealth) {
        const { specifics } = state.generalHealth;

        if (!specifics) {
            return 'Improve general health';
        } else {
            return `Improve general health, the client specified the following details: ${specifics}`;
        }
    }

    if (state.loseWeight) {
        const { currentWeight, targetWeight, unit } = state.loseWeight;

        const currentWeightInt = parseInt(currentWeight, 10);
        const targetWeightInt = parseInt(targetWeight, 10);

        const weightToLose = currentWeightInt - targetWeightInt;

        return `To lose ${weightToLose} ${unit}, reducing from ${currentWeight} ${unit} to ${targetWeight} ${unit}.`;
    }

    if (state.trainTriathlon) {
        return `To complete an ${state.trainTriathlon.distance} triathlon`;
    }

    if (state.generalFitness) {
        const { specifics } = state.generalFitness;

        if (!specifics) {
            return 'Improve general fitness';
        } else {
            return `Improve general fitness, the client specified the following details: ${specifics}`;
        }
    }

    // If we get here then the client has selected they'd like to run their first 5k
    return 'To run their first 5k';
}