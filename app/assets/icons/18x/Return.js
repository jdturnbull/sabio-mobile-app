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
                fill={props.color || '#f8f8f8'}
                d="M14.25 5.25v3H4.372l2.69-2.689L6 4.5 1.5 9 6 13.5l1.061-1.061L4.372 9.75H15.75v-4.5h-1.5Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
