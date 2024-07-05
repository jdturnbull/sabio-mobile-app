import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" {...props}>
    <Path
      fill="#f8f8f8"
      d="m26.34 17.61-3.28-3.28L16 21.4l-7.08-7.07-3.28 3.28L16 27.955 26.34 17.61ZM8.92 15.745l7.08 7.07 7.065-7.07 1.865 1.865L16 26.545 7.055 17.61l1.865-1.865Z"
    />
    <Path
      fill="#f8f8f8"
      d="M23.08 4.045 16 11.115l-7.065-7.07-3.28 3.28L16 17.67 26.35 7.32l-3.27-3.275Zm-16 3.28L8.945 5.46 16 12.53l7.08-7.075 1.865 1.865L16 16.255l-8.92-8.93Z"
    />
  </Svg>
);
export default SvgComponent;
