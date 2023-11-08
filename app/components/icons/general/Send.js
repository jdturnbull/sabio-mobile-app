import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={29} height={28} fill="none" {...props}>
    <Rect width={28} height={28} x={0.625} fill="#E66642" rx={14} />
    <Path
      fill="#fff"
      d="m7.158 14 1.316 1.316 5.217-5.208v11.359h1.867V10.108l5.208 5.217L22.092 14l-7.467-7.467L7.158 14Z"
    />
  </Svg>
);
export default SvgComponent;
