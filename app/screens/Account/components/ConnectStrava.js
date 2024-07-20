import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_STRAVA_REDIRECT, REACT_APP_STRAVA_CLIENT_ID } from '@env';
import SafariView from 'react-native-safari-view';
import Strava from "../../../assets/icons/24x/Strava";
import Premium from '../../../assets/icons/24x/Premium';
import call from "../../../utils/call";
import { updateState } from "../../../stores/user/userSlice";

const Container = styled(TouchableOpacity)`
    padding: 12px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    margin-vertical: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
`;

const IconContainer = styled.View`
    width: 24px;
    height: 24px;
    margin-right: 10px;
`;

const LabelText = styled.Text`
    font-size: ${(props) => props.theme.text.size.md};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    flex: 1;
`;


const ConnectStrava = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.user);
    const connections = useSelector((state) => state.user.connections);
    const [connected, setConnected] = useState(connections?.length > 0);

    useEffect(() => {
        setConnected(connections?.length > 0);
    }, [connections]);



    const handleConnect = async () => {
        if (connected) {
            return;
        }
        if (user.subscription_status !== 'SUBSCRIBED') {
            dispatch(updateState({ showSubscribeModal: true }));
        } else {
            try {
                const redirect_uri = encodeURIComponent(REACT_APP_STRAVA_REDIRECT);
                const url = `https://www.strava.com/oauth/authorize?response_type=code&client_id=${REACT_APP_STRAVA_CLIENT_ID}&redirect_uri=${redirect_uri}&approval_prompt=auto&scope=activity:read_all&state=${user.id}`;
                SafariView.show({ url });
            } catch (error) {
                console.log(error.message)
            }

        }
    }

    const handleSafariViewDismiss = async () => {
        const connection = await call('GET', `connection/retrieve/${user.id}`);
        if (connection) {
            updateState({ connections: [connection] });
        }
    }

    handleSafariViewDismiss();


    useEffect(() => {
        SafariView.addEventListener('onDismiss', handleSafariViewDismiss);
    }, []);

    return (
        <Container onPress={handleConnect}>
            <IconContainer>
                <Strava />
            </IconContainer>
            <LabelText>{connected ? 'Strava connected' : 'Connect Strava'}</LabelText>
            {user?.subscription_status !== 'SUBSCRIBED' && <Premium />}
        </Container>
    )
};

export default ConnectStrava;