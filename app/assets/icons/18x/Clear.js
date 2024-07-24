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
        <G
            stroke={props.color || '#f8f8f8'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            clipPath="url(#a)"
        >
            <Path d="M9 16.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM11.25 6.75l-4.5 4.5M6.75 6.75l4.5 4.5" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
