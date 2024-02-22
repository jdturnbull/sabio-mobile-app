import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <Path
      fill="#464646"
      d="M8.167 1.334A6.54 6.54 0 0 0 3.18 3.641l-.907-.807a.667.667 0 0 0-1.106.5v2.667a.667.667 0 0 0 .666.666h3a.667.667 0 0 0 .44-1.166l-1.1-.98a5.24 5.24 0 0 1 4-1.854 5.333 5.333 0 1 1-5.026 7.114.667.667 0 1 0-1.26.44 6.667 6.667 0 1 0 6.28-8.887Z"
    />
    <Path
      fill="#464646"
      d="M10.667 10.666a.667.667 0 0 1-.4-.133l-2.667-2a.667.667 0 0 1-.267-.534V5.333a.667.667 0 1 1 1.334 0v2.333l2.4 1.8a.667.667 0 0 1-.4 1.2Z"
    />
  </Svg>
);
export default SvgComponent;
