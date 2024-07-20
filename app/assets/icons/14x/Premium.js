import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        fill="none"
        {...props}
    >
        <Path
            fill={props.color || '#fff'}
            d="M12.25 5.49H1.75a.219.219 0 0 1-.167-.36l2.519-2.987a.219.219 0 0 1 .167-.078h5.464c.064 0 .126.029.167.078l2.518 2.987a.219.219 0 0 1-.167.36ZM2.222 5.052h9.56l-2.15-2.55h-5.26l-2.15 2.55Z"
        />
        <Path
            fill={props.color || '#fff'}
            d="M7 11.845 1.584 5.412l.335-.282L7 11.166l5.082-6.036.335.282L7 11.845Z"
        />
        <Path
            fill={props.color || '#fff'}
            d="M7 11.724a.219.219 0 0 1-.206-.146L4.596 5.344a.219.219 0 0 1 .03-.203l2.198-2.986c.083-.112.27-.112.353 0L9.375 5.14a.218.218 0 0 1 .03.203l-2.198 6.234a.218.218 0 0 1-.206.146ZM5.048 5.307 7 10.847l1.954-5.54-1.953-2.654-1.954 2.654Z"
        />
        <Path
            fill={props.color || '#fff'}
            d="m5.018 5.232-.534-2.986-.43.077.533 2.986.43-.077ZM9.948 2.323l-.43-.077-.534 2.986.43.077.534-2.986Z"
        />
    </Svg>
)
export default SvgComponent
