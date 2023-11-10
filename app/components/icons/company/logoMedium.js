import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={47} height={65} fill="none" {...props}>
    <Path fill="#F18F64" stroke="#000" d="M15.278 58.62 1.202 53.615l32.442-18.263 7.436 7.828L15.278 58.62Z" />
    <Path fill="#D63E13" stroke="#000" d="m12.822 29.105-7.647-8.3L31.123 5.923l13.969 4.407-32.27 18.774Z" />
    <Path fill="#E66642" stroke="#000" d="m2.052 22.896 9.964-6.704 31.127 25.59-9.964 6.705-31.127-25.59Z" />
  </Svg>
);
export default SvgComponent;
