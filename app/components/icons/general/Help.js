import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={38} height={38} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path fill="#fff" fillOpacity={0.8} d="M10.511 5.66h18.596v26.681H10.511z" />
      <Path
        fill="#16171B"
        d="M19 0a19 19 0 1 0 19 19A19.016 19.016 0 0 0 19 0Zm.032 30.083a1.582 1.582 0 1 1-.016-3.166h.016a1.584 1.584 0 0 1 0 3.166ZM22.056 19.8a2.606 2.606 0 0 0-1.473 2.229A1.645 1.645 0 0 1 19 23.682a1.53 1.53 0 0 1-1.583-1.515 5.77 5.77 0 0 1 3.11-5.141 3.167 3.167 0 0 0 1.583-3.365 3.205 3.205 0 0 0-2.534-2.525 3.166 3.166 0 0 0-3.743 3.114 1.583 1.583 0 1 1-3.166 0 6.334 6.334 0 1 1 9.389 5.55Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h38v38H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
