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
        <G fill={props.color || '#fff'} clipPath="url(#a)">
            <Path d="M12 .328C5.553.328.328 5.553.328 12c0 6.447 5.225 11.672 11.672 11.672 6.447 0 11.672-5.225 11.672-11.672C23.672 5.553 18.447.328 12 .328Zm0 22.41C6.08 22.738 1.262 17.921 1.262 12 1.262 6.08 6.079 1.262 12 1.262c5.92 0 10.738 4.817 10.738 10.738 0 5.92-4.817 10.738-10.738 10.738Z" />
            <Path d="m18.011 7.415-7.843 7.844-4.175-4.174-.662.663 4.837 4.836 8.501-8.506-.658-.663Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#fff'} d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
