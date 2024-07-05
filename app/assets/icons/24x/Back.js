import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="m17.08 4.913-1.827-1.828-8.668 8.668 8.668 8.667 1.827-1.828-6.84-6.84 6.84-6.84Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
