import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" {...props}>
    <Path
      fill="#A4D714"
      fillRule="evenodd"
      d="M10.5 21C16.299 21 21 16.299 21 10.5S16.299 0 10.5 0 0 4.701 0 10.5 4.701 21 10.5 21Zm-5.727-9.137h7.922L9.656 14.91l1.305 1.31 5.266-5.284-5.266-5.284-1.305 1.31 3.039 3.048H4.773v1.852Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
