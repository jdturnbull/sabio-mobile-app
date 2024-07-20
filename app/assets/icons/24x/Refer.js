import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <Path
            fill="#fff"
            d="M18 15.75a2.991 2.991 0 0 0-2.162.923L8.901 12.77a2.993 2.993 0 0 0 0-1.54l6.937-3.903a2.99 2.99 0 1 0-.737-1.307L8.163 9.923a3 3 0 1 0 0 4.154l6.938 3.903A3 3 0 1 0 18 15.75Z"
        />
    </Svg>
)
export default SvgComponent
