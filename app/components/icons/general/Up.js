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
      d="M4.397 9.052 7.5 5.948l3.104 3.104"
    />
  </Svg>
);
export default SvgComponent;
