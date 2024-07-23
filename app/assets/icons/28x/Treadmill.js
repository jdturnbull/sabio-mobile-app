import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        fill="none"
        {...props}
    >
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.167 7a2.333 2.333 0 1 0 0-4.667 2.333 2.333 0 0 0 0 4.667ZM12.382 8.478l-3.86 4.824 4.825 4.825-2.412 5.307"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m5.146 9.925 3.95-3.86 3.286 2.413 3.377 3.86h2.009M8.04 17.162l-1.447.965h-3.86M3.9 25.127l17.86-2.333V9.334"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M24.373 7 21.76 9.333l-1.926 1.75M24.373 25.329l-2.614-2.535"
        />
    </Svg>
)
export default SvgComponent
