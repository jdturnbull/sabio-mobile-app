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
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7.96 5.45 5.479 8.552l3.101 3.101-1.55 3.412"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m3.308 6.38 2.54-2.48L7.96 5.45l2.17 2.481h1.292M5.169 11.033l-.93.62H1.756M2.507 16.153l11.481-1.5V6"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.669 4.5 13.989 6 12.75 7.125M15.668 16.283l-1.68-1.63"
        />
    </Svg>
)
export default SvgComponent
