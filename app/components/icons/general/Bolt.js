import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={11} height={18} fill="none" {...props}>
    <Path fill="#000" stroke="#FFBE3F" d="M4.48 17v-6.26H1L6 1v6.26h3.35L4.48 17Z" />
  </Svg>
);
export default SvgComponent;
