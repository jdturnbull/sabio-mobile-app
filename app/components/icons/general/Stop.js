import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#000"
        d="M12.5 0C5.596 0 0 5.596 0 12.5S5.596 25 12.5 25 25 19.404 25 12.5 19.404 0 12.5 0ZM3.125 12.5c0-2.021.65-3.89 1.742-5.425l13.057 13.057a9.304 9.304 0 0 1-5.424 1.743c-5.17 0-9.375-4.204-9.375-9.375Zm17.007 5.425L7.075 4.867A9.316 9.316 0 0 1 12.5 3.125c5.17 0 9.375 4.206 9.375 9.375a9.31 9.31 0 0 1-1.743 5.425Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h25v25H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
