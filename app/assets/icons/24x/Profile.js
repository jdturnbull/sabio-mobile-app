import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G fill={props.color || '#fff'} clipPath="url(#a)">
      <Path d="M21 6.75H8.25a.75.75 0 0 1 0-1.5H21a.75.75 0 1 1 0 1.5ZM5.25 6.75H3a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 0 1.5ZM15.75 12.75H3a.75.75 0 1 1 0-1.5h12.75a.75.75 0 1 1 0 1.5ZM8.25 18.75H3a.75.75 0 1 1 0-1.5h5.25a.75.75 0 1 1 0 1.5Z" />
      <Path d="M6.75 8.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0-3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM17.25 14.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0-3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM9.75 20.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0-3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
      <Path d="M21 12.75h-2.25a.75.75 0 1 1 0-1.5H21a.75.75 0 1 1 0 1.5ZM21 18.75h-9.75a.75.75 0 1 1 0-1.5H21a.75.75 0 1 1 0 1.5Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={props.color || '#fff'} d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
