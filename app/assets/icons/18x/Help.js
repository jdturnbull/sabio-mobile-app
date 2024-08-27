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
                d="M9 1.5A7.498 7.498 0 0 0 1.5 9c0 4.144 3.356 7.5 7.5 7.5s7.5-3.356 7.5-7.5S13.144 1.5 9 1.5Zm.75 12.75h-1.5v-1.5h1.5v1.5Zm1.549-5.809-.671.69c-.54.54-.878.994-.878 2.119h-1.5v-.375c0-.829.338-1.579.877-2.123l.934-.945A1.5 1.5 0 1 0 7.5 6.75H6a3 3 0 1 1 6 .001 2.38 2.38 0 0 1-.701 1.691Z"
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
