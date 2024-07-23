import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Path
                fill="#fff"
                d="m8.886 10.164 3.74-2.716c.42-.307.93-.465 1.45-.448a3.052 3.052 0 0 1 2.831 2.123c.217.68.416 1.14.595 1.38a5.823 5.823 0 0 0 4.665 2.33v2.334a8.15 8.15 0 0 1-6.303-2.972l-.813 4.614 2.405 2.019 2.593 7.126-2.193.798-2.38-6.538-3.955-3.32a2.333 2.333 0 0 1-.832-2.22l.594-3.367-.79.574-2.482 3.416-1.887-1.372 2.743-3.775.02.014Zm6.864-3.747a2.333 2.333 0 1 1 0-4.667 2.333 2.333 0 0 1 0 4.667Zm-3.467 15.377-3.75 4.469-1.787-1.5 3.472-4.136.87-2.544 2.09 1.75-.895 1.962Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h28v28H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
