import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <G fill={props.color} clipPath="url(#a)">
      <Path d="M.781 12.5a11.719 11.719 0 1 1 23.438 0 11.719 11.719 0 0 1-23.438 0Zm1.563 0a10.156 10.156 0 1 0 20.312 0 10.156 10.156 0 0 0-20.312 0Z" />
      <Path d="m8.133 14.524 4.367-4.36 4.367 4.36a.781.781 0 0 0 1.102 0 .781.781 0 0 0 0-1.102l-4.97-4.968a.711.711 0 0 0-1 0l-4.968 4.968a.781.781 0 0 0 0 1.102.781.781 0 0 0 1.102 0Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h25v25H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
