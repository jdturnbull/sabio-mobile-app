import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <Path
      fill={props.color || '#000'}
      d="m16.028 18.692-2.176-4.288H10.66L16.03 25l5.364-10.596h-3.194m-7.3-5.832 2.954 5.831H18.2L10.899 0 3.607 14.404H7.95"
    />
  </Svg>
);
export default SvgComponent;
