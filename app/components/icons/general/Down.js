import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none" {...props}>
    <Path
      stroke="#FF912D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M10.603 5.948 7.5 9.052 4.397 5.948"
    />
  </Svg>
);
export default SvgComponent;
