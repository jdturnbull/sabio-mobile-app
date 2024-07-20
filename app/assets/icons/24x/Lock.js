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
            d="M17.363 10.762h-1.125v-2.4c0-2.325-1.913-4.237-4.238-4.237S7.763 6.037 7.763 8.363v2.4H6.638v-2.4C6.638 5.4 9.038 3 12 3c2.963 0 5.363 2.4 5.363 5.363v2.4Z"
        />
        <Path
            fill="#fff"
            d="M16.8 20.962H7.2c-.975 0-1.8-.825-1.8-1.8v-7.2c0-.974.825-1.8 1.8-1.8h9.6c.975 0 1.8.825 1.8 1.8v7.2a1.8 1.8 0 0 1-1.8 1.8Zm-9.6-9.6c-.337 0-.6.263-.6.6v7.2c0 .338.263.6.6.6h9.6c.337 0 .6-.262.6-.6v-7.2c0-.337-.262-.6-.6-.6H7.2Z"
        />
        <Path
            fill="#fff"
            d="M13.2 13.762c0 .675-.525 1.2-1.2 1.2-.675 0-1.2-.524-1.2-1.2 0-.675.525-1.2 1.2-1.2.675 0 1.2.563 1.2 1.2Z"
        />
        <Path fill="#fff" d="M12.3 13.762h-.6l-.6 3.6h1.8l-.6-3.6Z" />
    </Svg>
)
export default SvgComponent
