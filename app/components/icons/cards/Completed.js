import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none" {...props}>
    <Path
      fill={props.color ? props.color : '#fff'}
      d="M12.5 22.5c-.625 0-1.25-.25-1.75-.75l-5-5c-1-1-1-2.5 0-3.5s2.625-1 3.5 0l3.25 3.25 8.25-8.25c1-1 2.5-1 3.5 0s1 2.5 0 3.5l-10 10c-.5.5-1.125.75-1.75.75Z"
    />
  </Svg>
);
export default SvgComponent;
