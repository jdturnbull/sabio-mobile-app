import React, { useState } from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import moment from "moment";
import styled from 'styled-components';
import Avatar from '../../../../assets/icons/24x/Account';
import BodyText from "../../../../components/shared/BodyText";
import Like from '../../../../assets/icons/18x/Like';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { hapticImpact } from "../../../../utils/haptics";
import call from "../../../../utils/call";
import { usePostHog } from "posthog-react-native";

const Container = styled.View`
    background-color: ${(props) => props.theme.colors.background2};
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const Top = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const UsernameText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
    margin-left: 10px;
`;

const TimeText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
`;

const Content = styled.View`
    margin-top: 15px;
`;

const IconText = styled.Text`
    font-size: 18px;
`;

const TitleText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
    color: ${(props) => props.theme.text.colors.white};
    margin-left: 10px;
`;

const Post = ({ post, userId, username }) => {
    const posthog = usePostHog();
    const [liked, setLiked] = useState(post.likes.split(',').includes(userId.toString()));
    const [likeCount, setLikeCount] = useState(post.likes.split(',').filter((d) => !!d).length);

    const time = moment(post.created_at).fromNow();
    let lastTap = null;

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handleLike = async () => {
        if (!liked) {
            posthog.capture('like_post', { postId: post.id });
            setLiked(true);
            hapticImpact();
            setLikeCount(likeCount + 1);

            scale.value = withSpring(1.5, {}, () => {
                scale.value = withSpring(1);
            });

            await call('POST', 'users/addLike', { postId: post.id, userId: userId });
        }
    }

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (lastTap && (now - lastTap) < 300) {
            handleLike();
        } else {
            lastTap = now;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
            <Container>
                <Top>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar />
                        <UsernameText>
                            {post.author === username ? 'You' : post.author}
                        </UsernameText>
                    </View>
                    <TimeText>
                        {time}
                    </TimeText>
                </Top>
                <Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconText>{post.icon}</IconText>
                        <TitleText>
                            {post.title}
                        </TitleText>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row', }}>
                        <BodyText style={{ fontWeight: 500, flex: 1 }}>
                            {post.body}
                        </BodyText>
                        <View>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <BodyText style={{ fontWeight: 500, marginRight: 5 }}>
                                    {likeCount === 0 ? null : likeCount}
                                </BodyText>
                                <Animated.View style={animatedStyle}>
                                    <Like color={liked ? 'red' : null} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
            </Container>
        </TouchableWithoutFeedback>
    )
}

export default Post;