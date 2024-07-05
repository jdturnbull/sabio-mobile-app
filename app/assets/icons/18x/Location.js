import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <G fill={props.color || '#f8f8f8'} clipPath="url(#a)">
      <Path d="M16.875 7.875h-1.239a6.738 6.738 0 0 0-5.511-5.511V1.125a1.125 1.125 0 1 0-2.25 0v1.239a6.737 6.737 0 0 0-5.511 5.511H1.125a1.125 1.125 0 0 0 0 2.25h1.239a6.737 6.737 0 0 0 5.511 5.511v1.239a1.125 1.125 0 0 0 2.25 0v-1.239a6.737 6.737 0 0 0 5.511-5.511h1.239a1.125 1.125 0 1 0 0-2.25ZM9 13.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
      <Path d="M9 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={props.color || '#f8f8f8'} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
