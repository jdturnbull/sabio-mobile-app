import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      d="M12.69 12.06a1 1 0 0 1-1.34 0L2.87 4.35A2 2 0 0 1 4 4h16a2 2 0 0 1 1.13.35l-8.44 7.71Z"
    />
    <Path
      fill={props.color || '#fff'}
      d="M22 6.26V17a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6.26l8.68 7.92a2 2 0 0 0 1.32.49 2 2 0 0 0 1.33-.51L22 6.26Z"
    />
  </Svg>
);
export default SvgComponent;
