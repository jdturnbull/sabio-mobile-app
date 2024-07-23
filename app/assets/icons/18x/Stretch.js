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
                fill="#fff"
                d="M12.085 8.28c-1.11-2.347-.94-1.976-.984-2.103L10.08 3.206a.638.638 0 0 0-.092-.175L7.911.256a.637.637 0 0 0-1.02.763l2.016 2.696.717 2.086-4.823 2.282a.91.91 0 0 0-.567.698L3.21 17.045a.85.85 0 1 0 1.687.21l.929-7.496.938 1.197 1.936 6.44a.85.85 0 0 0 1.628-.49l-1.88-6.249 2.365-1.198-.595 2.734a.638.638 0 0 0-.013.179l.204 3.015a.64.64 0 0 0 .68.593.636.636 0 0 0 .592-.68l-.199-2.924.697-3.199a1.497 1.497 0 0 0-.094-.897Zm1.236-.667a1.475 1.475 0 1 0 0-2.95 1.475 1.475 0 0 0 0 2.95Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
