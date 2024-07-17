import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      d="M22.5 3.938h-6a1.5 1.5 0 1 0 0 3h2.379L13.5 12.316l-4.94-4.94a1.5 1.5 0 0 0-2.12 0l-6 6.001a1.5 1.5 0 0 0 2.12 2.121l4.94-4.94 4.94 4.94a1.498 1.498 0 0 0 2.12 0L21 9.058v2.38a1.5 1.5 0 1 0 3 0v-6a1.5 1.5 0 0 0-1.5-1.5Z"
    />
  </Svg>
);
export default SvgComponent;
