import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
    <Path
      fill={props.active ? '#E66642' : '#ffffff80'}
      d="M14 1.75c-7.733 0-14 5.091-14 11.375 0 2.713 1.17 5.195 3.117 7.148-.683 2.756-2.97 5.211-2.997 5.239a.435.435 0 0 0-.082.476.428.428 0 0 0 .4.262c3.625 0 6.343-1.74 7.689-2.81A16.68 16.68 0 0 0 14 24.5c7.733 0 14-5.091 14-11.375S21.733 1.75 14 1.75Z"
    />
  </Svg>
);
export default SvgComponent;
