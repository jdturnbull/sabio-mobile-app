import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: animate */
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={200} height={200} {...props}>
    <Circle cx={100} cy={100} r={20} fill="#0d47a1"></Circle>
    <Circle cx={50} cy={50} r={10} fill="#0d47a1" />
    <Circle cx={150} cy={50} r={10} fill="#0d47a1" />
    <Circle cx={50} cy={150} r={10} fill="#0d47a1" />
    <Circle cx={150} cy={150} r={10} fill="#0d47a1" />
    <Path stroke="#0d47a1" strokeWidth={2} d="M100 100 50 50"></Path>
    <Path stroke="#0d47a1" strokeWidth={2} d="m100 100 50-50"></Path>
    <Path stroke="#0d47a1" strokeWidth={2} d="m100 100-50 50"></Path>
    <Path stroke="#0d47a1" strokeWidth={2} d="m100 100 50 50"></Path>
  </Svg>
);
export default SvgComponent;
