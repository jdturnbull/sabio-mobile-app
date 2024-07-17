import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="M25.333 4H24V1.333h-2.667V4H10.667V1.333H8V4H6.667c-1.48 0-2.654 1.2-2.654 2.667L4 25.333A2.666 2.666 0 0 0 6.667 28h18.666C26.8 28 28 26.8 28 25.333V6.667C28 5.2 26.8 4 25.333 4Zm0 6.667v14.666H6.667V10.667h18.666ZM16 13.333H9.333V20H16v-6.667Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
