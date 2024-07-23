import * as React from "react"
import Svg, { G, Mask, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Mask
                id="b"
                width={28}
                height={28}
                x={0}
                y={0}
                maskUnits="userSpaceOnUse"
                style={{
                    maskType: "luminance",
                }}
            >
                <Path fill="#fff" d="M28 28H0V0h28v28Z" />
            </Mask>
            <G mask="url(#b)">
                <Path
                    fill="#fff"
                    d="m9.917 16.917-5.25 5.25 1.75 1.75 4.083-4.084h2.333l-2.916-2.916ZM17.5 1.167A2.34 2.34 0 0 0 15.167 3.5 2.34 2.34 0 0 0 17.5 5.833 2.34 2.34 0 0 0 19.833 3.5 2.34 2.34 0 0 0 17.5 1.167Zm7 23.345L21 28l-3.488-3.512V22.75l-8.284-8.272a6.602 6.602 0 0 1-1.061.082v-2.52c1.936.035 4.211-1.015 5.448-2.38l1.633-1.808c.222-.245.502-.444.805-.584A2.596 2.596 0 0 1 17.173 7h.035a2.647 2.647 0 0 1 2.625 2.637v6.708c0 .98-.408 1.878-1.073 2.52l-4.177-4.177V12.04a11.313 11.313 0 0 1-2.671 1.622L19.25 21H21l3.5 3.512Z"
                />
            </G>
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h28v28H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
