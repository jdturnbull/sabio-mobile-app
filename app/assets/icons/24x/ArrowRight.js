import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      fillRule="evenodd"
      d="m6.92 19.087 1.827 1.828 8.668-8.668L8.747 3.58 6.92 5.408l6.84 6.84-6.84 6.84Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
