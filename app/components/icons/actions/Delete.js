import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#E66642"
        d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0ZM3 12c0-1.94.623-3.735 1.673-5.208l12.534 12.535A8.933 8.933 0 0 1 12 21c-4.964 0-9-4.036-9-9Zm16.327 5.208L6.792 4.673A8.943 8.943 0 0 1 12 3c4.964 0 9 4.037 9 9 0 1.94-.623 3.736-1.673 5.208Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
