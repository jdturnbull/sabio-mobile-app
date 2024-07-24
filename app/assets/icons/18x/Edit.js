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
        <G fill={props.color || '#f8f8f8'} clipPath="url(#a)">
            <Path d="M1.125 17.438a.561.561 0 0 1-.563-.625l.507-4.595a.562.562 0 0 1 .163-.338L11.964 1.153a2.003 2.003 0 0 1 2.841 0l2.07 2.042a2.005 2.005 0 0 1 0 2.84L6.12 16.763a.562.562 0 0 1-.338.164l-4.595.512h-.062Zm1.046-4.905-.41 3.706 3.707-.41L16.053 5.237a.889.889 0 0 0 0-1.249l-2.042-2.042a.889.889 0 0 0-1.249 0L2.171 12.533Z" />
            <Path d="M14.918 7.729a.563.563 0 0 1-.394-.163l-4.09-4.09a.57.57 0 0 1 .816-.793l4.067 4.067a.562.562 0 0 1 0 .793.562.562 0 0 1-.4.186ZM10.43 6.773 5.323 11.88l.796.795 5.107-5.107-.796-.795Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
