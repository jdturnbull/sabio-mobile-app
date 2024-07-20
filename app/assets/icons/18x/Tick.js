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
                fill={props.color || '#fff'}
                d="M9 .75a8.25 8.25 0 1 0 0 16.5A8.25 8.25 0 0 0 9 .75Zm4.28 6.53-5.25 5.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 1.06-1.06l1.72 1.72 4.72-4.72a.75.75 0 0 1 1.06 1.06Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#fff'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
