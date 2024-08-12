import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <G fill={props.color || '#f8f8f8'} clipPath="url(#a)">
            <Path d="M12 22.5a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 0 21Zm0 1.5a12 12 0 1 0 0-24 12 12 0 0 0 0 24Z" />
            <Path d="m13.395 9.882-3.435.43-.123.57.675.125c.441.105.528.264.432.704l-1.107 5.202c-.291 1.345.157 1.978 1.212 1.978.818 0 1.767-.378 2.197-.897l.133-.624c-.3.264-.739.369-1.03.369-.412 0-.562-.29-.456-.8l1.502-7.057ZM13.5 6.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
