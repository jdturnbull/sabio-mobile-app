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
            d="M3 8v9c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-6c0-2.2-1.8-4-4-4h-3.4l-.9-1.8C12 3.8 10.7 3 9.1 3H7C4.8 3 3 4.8 3 7v1Zm4-3h2.1c.8 0 1.4.4 1.8 1.1l.5.9H5c0-1.1.9-2 2-2ZM5 9h12c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9Z"
        />
        <Path
            fill="#fff"
            d="M11.3 16.7c.2.2.5.3.7.3.2 0 .5-.1.7-.3l2-2c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0l-.3.3V12c0-.6-.4-1-1-1s-1 .4-1 1v1.6l-.3-.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2Z"
        />
    </Svg>
)
export default SvgComponent
