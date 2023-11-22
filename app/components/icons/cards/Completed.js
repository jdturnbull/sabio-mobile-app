import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={128} height={140} fill="none" {...props}>
    <Path fill="#A4D714" d="m73.2 47-1.533-7.667h-34.5V104.5h7.666V77.667H66.3l1.533 7.666h26.834V47H73.2Z" />
  </Svg>
);
export default SvgComponent;
