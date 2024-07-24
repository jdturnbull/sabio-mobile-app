import * as React from "react"
import Svg, { G, Mask, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Mask
                id="b"
                width={18}
                height={18}
                x={0}
                y={0}
                maskUnits="userSpaceOnUse"
                style={{
                    maskType: "luminance",
                }}
            >
                <Path fill={props.color || '#f8f8f8'} d="M18 18H0V0h18v18Z" />
            </Mask>
            <G mask="url(#b)">
                <Path
                    fill={props.color || '#f8f8f8'}
                    d="M6.375 10.875 3 14.25l1.125 1.125L6.75 12.75h1.5l-1.875-1.875ZM11.25.75c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5Zm4.5 15.008L13.5 18l-2.242-2.258v-1.117L5.933 9.307a4.249 4.249 0 0 1-.683.053V7.74c1.245.022 2.707-.652 3.502-1.53l1.05-1.162c.143-.158.323-.285.518-.375.217-.106.465-.173.72-.173h.023c.93.008 1.687.765 1.687 1.695v4.313c0 .63-.262 1.207-.69 1.62L9.375 9.442V7.74a7.274 7.274 0 0 1-1.718 1.043l4.718 4.717H13.5l2.25 2.258Z"
                />
            </G>
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
