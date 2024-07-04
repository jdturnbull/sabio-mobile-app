import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      fillRule="evenodd"
      d="M14.25 2.25h-.75V.75H12v1.5H6V.75H4.5v1.5h-.75c-.833 0-1.493.675-1.493 1.5l-.007 10.5a1.5 1.5 0 0 0 1.5 1.5h10.5c.825 0 1.5-.675 1.5-1.5V3.75c0-.825-.675-1.5-1.5-1.5Zm0 3.75v8.25H3.75V6h10.5ZM9 7.5H5.25v3.75H9V7.5Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
