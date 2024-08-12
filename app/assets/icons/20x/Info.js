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
        <G fill={props.color || '#fff'} clipPath="url(#a)">
            <Path d="M10 18.75a8.75 8.75 0 1 1 0-17.5 8.75 8.75 0 0 1 0 17.5ZM10 20a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <Path d="M11.162 8.235 8.3 8.594l-.103.475.563.103c.367.088.44.22.36.587l-.922 4.335c-.243 1.121.13 1.649 1.01 1.649.68 0 1.472-.316 1.83-.748l.11-.52c-.25.22-.614.308-.857.308-.344 0-.469-.242-.38-.667l1.252-5.881Zm.088-2.61a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#fff'} d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
