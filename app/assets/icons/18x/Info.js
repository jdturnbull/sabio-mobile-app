import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <G fill={props.color || '#f8f8f8'} clipPath="url(#a)">
            <Path d="M9 16.875a7.875 7.875 0 1 1 0-15.75 7.875 7.875 0 0 1 0 15.75ZM9 18A9 9 0 1 0 9 0a9 9 0 0 0 0 18Z" />
            <Path d="m10.046 7.412-2.576.322-.092.428.506.093c.33.079.396.198.324.528l-.83 3.901c-.218 1.01.118 1.484.909 1.484.613 0 1.325-.283 1.648-.672l.099-.469c-.225.199-.554.277-.772.277-.31 0-.422-.217-.342-.6l1.126-5.293Zm.079-2.35a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
