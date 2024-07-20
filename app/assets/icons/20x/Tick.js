import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Path
                fill={props.color || '#fff'}
                d="M10 .833a9.167 9.167 0 1 0 0 18.334A9.167 9.167 0 0 0 10 .833Zm4.756 7.256-5.833 5.833a.833.833 0 0 1-1.179 0l-2.5-2.5a.833.833 0 0 1 1.179-1.178l1.91 1.911 5.245-5.244a.833.833 0 0 1 1.178 1.178Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#fff'} d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
