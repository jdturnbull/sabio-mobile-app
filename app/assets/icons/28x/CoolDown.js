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
            fill="#fff"
            d="M22.273 14.276a.696.696 0 0 0-.604-.349h-1.627V9.354a.697.697 0 0 0-1.395 0v4.573H17.02a.697.697 0 0 0-.603 1.046l2.324 4.026a.698.698 0 0 0 1.207 0l2.325-4.026a.696.696 0 0 0 0-.697ZM13.071 16.798V5.633a2.79 2.79 0 0 0-5.578 0v11.165a4.648 4.648 0 1 0 5.578 0Zm-2.789 5.57a1.857 1.857 0 0 1-.697-3.58V14.25a.697.697 0 1 1 1.394 0v4.537a1.857 1.857 0 0 1-.697 3.58Z"
        />
    </Svg>
)
export default SvgComponent
