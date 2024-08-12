import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        fill="none"
        {...props}
    >
        <G fill={props.color || '#f8f8f8'} clipPath="url(#a)">
            <Path d="M7 13.125A6.125 6.125 0 1 1 7 .875a6.125 6.125 0 0 1 0 12.25ZM7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Z" />
            <Path d="m7.814 5.764-2.004.252-.072.332.394.073c.257.061.308.154.252.41l-.646 3.035c-.17.784.092 1.154.707 1.154.477 0 1.031-.22 1.282-.524l.077-.364a.97.97 0 0 1-.6.216c-.24 0-.328-.17-.266-.467l.876-4.117Zm.061-1.827a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h14v14H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
