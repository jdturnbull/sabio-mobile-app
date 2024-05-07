import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <Path
      fill={props.color}
      d="M12.5.781a11.719 11.719 0 1 1 0 23.438A11.719 11.719 0 0 1 12.5.78Zm0 21.875a10.156 10.156 0 1 0 0-20.312 10.156 10.156 0 0 0 0 20.312Z"
    />
    <Path
      fill={props.color}
      d="m8.133 10.476 4.367 4.36 4.367-4.36a.781.781 0 0 1 1.102 0 .781.781 0 0 1 0 1.102l-4.97 4.969a.711.711 0 0 1-1 0l-4.968-4.97a.781.781 0 0 1 0-1.1.781.781 0 0 1 1.102 0Z"
    />
  </Svg>
);
export default SvgComponent;
