import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <G fill="#fff" clipPath="url(#a)">
            <Path d="M11 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4.586l2.104 2.103a.5.5 0 0 1 0 .707l-.708.708a.5.5 0 0 1-.707 0l-2.543-2.543a.5.5 0 0 1-.146-.354V7Z" />
            <Path
                fillRule="evenodd"
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
