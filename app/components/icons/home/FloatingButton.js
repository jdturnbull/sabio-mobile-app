import * as React from 'react';
import Svg, { Rect, G, Path, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={70} height={70} fill="none" {...props}>
    <Rect width={70} height={70} fill="url(#a)" rx={35} />
    <G clipPath="url(#b)">
      <Path
        fill="#fff"
        d="M35 19.25c-9.942 0-18 6.546-18 14.625 0 3.488 1.505 6.68 4.008 9.19-.88 3.544-3.818 6.7-3.853 6.736a.559.559 0 0 0-.106.612.55.55 0 0 0 .513.337c4.662 0 8.157-2.236 9.886-3.614 2.3.865 4.852 1.364 7.552 1.364 9.942 0 18-6.546 18-14.625S44.942 19.25 35 19.25Z"
      />
    </G>
    <Defs>
      <LinearGradient id="a" x1={35} x2={35} y1={0} y2={70} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#D63E13" />
        <Stop offset={0.854} stopColor="#E66642" />
        <Stop offset={1} stopColor="#F18F64" />
      </LinearGradient>
      <ClipPath id="b">
        <Path fill="#fff" d="M17 17h36v36H17z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
