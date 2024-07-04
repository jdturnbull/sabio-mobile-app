import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      fillRule="evenodd"
      d="M16.5 3c0 .975-.62 2.167-1.21 3.079a1.22 1.22 0 0 1-2.08 0C12.62 5.167 12 3.975 12 3a2.25 2.25 0 1 1 4.5 0ZM6 13.5c0 .975-.62 2.167-1.21 3.079a1.22 1.22 0 0 1-2.08 0c-.59-.912-1.21-2.104-1.21-3.079a2.25 2.25 0 1 1 4.5 0Zm1.575-9.75a3.075 3.075 0 1 0 0 6.15h4.5a1.425 1.425 0 0 1 0 2.85H8.25a.75.75 0 0 0 0 1.5h3.825a2.925 2.925 0 0 0 0-5.85h-4.5a1.575 1.575 0 1 1 0-3.15H10.5a.75.75 0 0 0 0-1.5H7.575Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
