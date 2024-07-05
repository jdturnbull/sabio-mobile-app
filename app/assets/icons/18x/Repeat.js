import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="M9 .75V3c3.315 0 6 2.685 6 6a5.948 5.948 0 0 1-.93 3.195L12.975 11.1A4.403 4.403 0 0 0 13.5 9c0-2.482-2.018-4.5-4.5-4.5v2.25l-3-3 3-3ZM4.5 9c0 2.482 2.018 4.5 4.5 4.5v-2.25l3 3-3 3V15c-3.315 0-6-2.685-6-6 0-1.178.345-2.272.93-3.195L5.025 6.9A4.403 4.403 0 0 0 4.5 9Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
