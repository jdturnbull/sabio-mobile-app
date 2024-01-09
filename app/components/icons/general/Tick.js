import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={34} height={34} fill="none" {...props}>
    <Path
      fill="#81AE6F"
      d="M14.167 25.5c-.709 0-1.417-.283-1.984-.85l-5.666-5.667c-1.134-1.133-1.134-2.833 0-3.966 1.133-1.134 2.975-1.134 3.966 0l3.684 3.683 9.35-9.35c1.133-1.133 2.833-1.133 3.966 0 1.134 1.133 1.134 2.833 0 3.967L16.15 24.65c-.567.567-1.275.85-1.983.85Z"
    />
  </Svg>
);
export default SvgComponent;
