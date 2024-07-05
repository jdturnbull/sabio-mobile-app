import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="m12.81 3.685-1.37-1.371-6.501 6.5 6.5 6.5 1.371-1.37-5.13-5.13 5.13-5.13Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M18 18H0V0h18z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
