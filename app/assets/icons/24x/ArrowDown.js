import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M4.913 6.92 3.085 8.747l8.668 8.668 8.667-8.668-1.828-1.827-6.84 6.84-6.84-6.84Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
