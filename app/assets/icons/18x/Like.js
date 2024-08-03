import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Path
                fill={props.color || '#f8f8f820'}
                d="M16.253 2.2C14.326.56 11.46.855 9.693 2.68L9 3.393l-.693-.714C6.543.854 3.674.559 1.747 2.2-.46 4.085-.577 7.467 1.4 9.51l6.803 7.024c.44.454 1.153.454 1.592 0l6.803-7.024c1.98-2.043 1.863-5.425-.344-7.31Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f820'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
