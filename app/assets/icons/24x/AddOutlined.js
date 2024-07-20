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
        <G fill="#fff" clipPath="url(#a)">
            <Path d="M12 21.75a9.75 9.75 0 1 1 0-19.499 9.75 9.75 0 0 1 0 19.499Zm0-18a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Z" />
            <Path d="M12 17.25a.75.75 0 0 1-.75-.75v-9a.75.75 0 1 1 1.5 0v9a.75.75 0 0 1-.75.75Z" />
            <Path d="M16.5 12.75h-9a.75.75 0 1 1 0-1.5h9a.75.75 0 1 1 0 1.5Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
