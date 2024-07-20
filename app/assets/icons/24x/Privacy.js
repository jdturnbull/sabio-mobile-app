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
            d="M19.5 18a.75.75 0 0 0-.75.75v3H5.25v-9h13.5a.75.75 0 1 0 0-1.5h-1.5V6A5.256 5.256 0 0 0 12 .75 5.256 5.256 0 0 0 6.75 6v5.25H4.5a.75.75 0 0 0-.75.75v10.5c0 .415.336.75.75.75h15a.75.75 0 0 0 .75-.75v-3.75a.75.75 0 0 0-.75-.75ZM8.25 6A3.754 3.754 0 0 1 12 2.25 3.754 3.754 0 0 1 15.75 6v5.25h-7.5V6Z"
        />
        <Path
            fill="#fff"
            d="M23.047 11.487a.75.75 0 0 0-1.06-.035l-7.502 7.02-3.472-3.249a.75.75 0 0 0-1.024 1.096l3.984 3.729a.748.748 0 0 0 1.025 0l8.016-7.5a.752.752 0 0 0 .034-1.061Z"
        />
    </Svg>
)
export default SvgComponent
