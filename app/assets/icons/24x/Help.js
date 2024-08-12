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
        <G clipPath="url(#a)">
            <Path
                fill={props.color || '#f8f8f8'}
                d="M12 2C6.475 2 2 6.475 2 12s4.475 10 10 10 10-4.475 10-10S17.525 2 12 2Zm1 17h-2v-2h2v2Zm2.065-7.745-.895.92C13.45 12.895 13 13.5 13 15h-2v-.5c0-1.105.45-2.105 1.17-2.83l1.245-1.26A2 2 0 1 0 10 9H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.355 1.675-.935 2.255Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
