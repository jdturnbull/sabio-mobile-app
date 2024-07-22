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
        <G clipPath="url(#a)">
            <Path
                fill={props.color || "#fff"}
                fillRule="evenodd"
                d="m14.316 12.81 1.37-1.37-6.5-6.501-6.5 6.5 1.37 1.371 5.13-5.13 5.13 5.13Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || "#fff"} d="M0 18V0h18v18z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
