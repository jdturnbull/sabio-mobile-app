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
            fill="#F50"
            d="M9.602 1.219 3.226 13.516h3.756l2.62-4.89 2.598 4.89h3.727L9.602 1.22Z"
        />
        <Path
            fill="#FFAF8A"
            d="m15.927 13.516-1.848 3.715-1.879-3.715H9.353l4.726 9.265 4.695-9.265h-2.847Z"
        />
    </Svg>
)
export default SvgComponent
