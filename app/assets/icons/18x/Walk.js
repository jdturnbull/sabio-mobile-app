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
                d="m5.713 6.534 2.404-1.746c.27-.197.598-.299.932-.288a1.962 1.962 0 0 1 1.82 1.365c.14.437.267.733.383.886A3.744 3.744 0 0 0 14.25 8.25v1.5a5.24 5.24 0 0 1-4.052-1.91l-.522 2.966 1.546 1.298 1.667 4.58-1.41.514-1.53-4.204-2.543-2.133a1.5 1.5 0 0 1-.534-1.428l.381-2.164-.507.369L5.15 9.834l-1.213-.882L5.7 6.525l.013.009Zm4.412-2.409a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-2.229 9.886-2.41 2.872-1.15-.963 2.233-2.66.559-1.635 1.343 1.125-.575 1.26Z"
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
