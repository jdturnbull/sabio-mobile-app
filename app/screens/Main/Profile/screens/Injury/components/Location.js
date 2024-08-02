import React, { useState } from "react";
import styled from "styled-components";
import Title from "../../../../../../components/shared/Title";
import SelectableItem from "../../../../../../components/shared/SelectableItem";

const LOCATIONS = [
    { id: 'back', label: 'Back' },
    { id: 'knee', label: 'Knee' },
    { id: 'shoulder', label: 'Shoulder' },
    { id: 'neck', label: 'Neck' },
    { id: 'elbow', label: 'Elbow' },
    { id: 'hip', label: 'Hip' },
    { id: 'achilles_tendon', label: 'Achilles tendon' },
    { id: 'ankle', label: 'Ankle' },
    { id: 'heel', label: 'Heel' },
    { id: 'sole_of_foot', label: 'Sole of foot' }
];

const Container = styled.View``;

const Location = ({ handleNext, setLocation, location }) => {

    const handlePress = (id) => {
        setLocation(id);
        handleNext();
    }


    return (
        <Container>
            <Title style={{ marginTop: 10, marginBottom: 20 }}>Where is your injury located?</Title>
            {LOCATIONS.map((_location) => (
                <SelectableItem key={_location.id} label={_location.label} selected={location === _location.label} onPress={() => handlePress(_location.label)} />
            ))}
        </Container>
    )
}

export default Location;