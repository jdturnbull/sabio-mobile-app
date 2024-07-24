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
            <Path d="M9 16.313A7.313 7.313 0 1 1 9 1.687a7.313 7.313 0 0 1 0 14.626Zm0-13.5a6.188 6.188 0 1 0 0 12.375A6.188 6.188 0 0 0 9 2.812Z" />
            <Path d="M9 12.938a.563.563 0 0 1-.563-.563v-6.75a.563.563 0 1 1 1.126 0v6.75a.562.562 0 0 1-.563.563Z" />
            <Path d="M12.375 9.563h-6.75a.563.563 0 1 1 0-1.126h6.75a.562.562 0 1 1 0 1.126Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
