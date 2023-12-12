import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={17} fill="none" {...props}>
    <Path
      stroke={props.color ? props.color : '#F0E5BD'}
      strokeLinecap="round"
      strokeWidth={5}
      d="M3 14 15 3M3 3l12 11"
    />
  </Svg>
);
export default SvgComponent;
