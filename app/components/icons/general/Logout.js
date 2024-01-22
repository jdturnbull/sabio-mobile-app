import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none" {...props}>
    <Path fill={props.color || '#fff'} fillRule="evenodd" d="M3.75 16.25h15v-2.5h-15v2.5Z" clipRule="evenodd" />
    <Path
      fill={props.color || '#fff'}
      fillRule="evenodd"
      d="m7.241 9.741-4.375 4.375a1.25 1.25 0 0 0 0 1.768l4.375 4.375 1.768-1.768L5.518 15l3.49-3.491L7.242 9.74ZM10 5c0-.69.56-1.25 1.25-1.25h15c.69 0 1.25.56 1.25 1.25v20c0 .69-.56 1.25-1.25 1.25h-15c-.69 0-1.25-.56-1.25-1.25v-3.75h2.5v2.5H25V6.25H12.5v2.5H10V5Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
