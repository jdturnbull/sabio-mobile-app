import * as React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={70} height={70} fill="none" {...props}>
    <Rect width={70} height={70} fill="url(#a)" rx={35} />
    <Path
      fill="#fff"
      d="M35 19.25c-9.942 0-18 6.546-18 14.625 0 3.487 1.505 6.68 4.008 9.19-.88 3.544-3.818 6.7-3.853 6.736a.559.559 0 0 0-.106.611.55.55 0 0 0 .514.338c4.661 0 8.156-2.236 9.885-3.614C29.748 48 32.3 48.5 35 48.5c9.942 0 18-6.546 18-14.625S44.942 19.25 35 19.25Z"
    />
    <Defs>
      <LinearGradient id="a" x1={35} x2={35} y1={0} y2={70} gradientUnits="userSpaceOnUse">
        <Stop offset={0.089} stopColor="#D63E13" />
        <Stop offset={0.599} stopColor="#E66642" />
        <Stop offset={1} stopColor="#F18F64" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SvgComponent;
