import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G fill="#fff" clipPath="url(#a)">
      <Path d="M12 21.75a3 3 0 0 1-3-3 .75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75 3 3 0 0 1-3 3Zm-1.297-2.25a1.5 1.5 0 0 0 2.595 0h-2.595ZM13.5 5.25h-3a.75.75 0 0 1-.75-.75 2.25 2.25 0 1 1 4.5 0 .75.75 0 0 1-.75.75Z" />
      <Path d="M20.25 19.5H3.75a.75.75 0 0 1-.75-.75 5.25 5.25 0 0 1 2.25-4.313V10.5a6.75 6.75 0 0 1 6.705-6.75h.082a6.75 6.75 0 0 1 6.75 6.75v3.938A5.25 5.25 0 0 1 21 18.75a.75.75 0 0 1-.75.75ZM4.575 18h14.85a3.75 3.75 0 0 0-1.8-2.498.75.75 0 0 1-.375-.652V10.5a5.25 5.25 0 1 0-10.5 0v4.35a.75.75 0 0 1-.375.652A3.75 3.75 0 0 0 4.575 18Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
