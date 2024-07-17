import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="M22.167 3.5H21V1.167h-2.333V3.5H9.333V1.167H7V3.5H5.833a2.323 2.323 0 0 0-2.321 2.333L3.5 22.167A2.333 2.333 0 0 0 5.833 24.5h16.334a2.34 2.34 0 0 0 2.333-2.333V5.833A2.34 2.34 0 0 0 22.167 3.5Zm0 5.833v12.834H5.833V9.333h16.334ZM14 11.667H8.167V17.5H14v-5.833Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
