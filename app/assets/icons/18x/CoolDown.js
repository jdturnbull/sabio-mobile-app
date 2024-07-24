import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <Path
            fill={props.color || '#f8f8f8'}
            d="M14.318 9.177a.448.448 0 0 0-.388-.224h-1.046v-2.94a.448.448 0 1 0-.896 0v2.94h-1.046a.448.448 0 0 0-.388.672l1.494 2.588a.45.45 0 0 0 .776 0l1.494-2.588a.448.448 0 0 0 0-.448ZM8.403 10.799V3.62a1.793 1.793 0 0 0-3.586 0V10.8a2.989 2.989 0 1 0 3.586 0Zm-1.793 3.58a1.193 1.193 0 0 1-.448-2.301V9.16a.448.448 0 0 1 .896 0v2.917a1.194 1.194 0 0 1-.448 2.3Z"
        />
    </Svg>
)
export default SvgComponent
