import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="#fff"
      fillOpacity={props.selected ? 0.9 : 0.3}
      d="M12 1.5c-6.628 0-12 4.364-12 9.75 0 2.325 1.003 4.453 2.672 6.127-.586 2.362-2.545 4.467-2.569 4.49a.373.373 0 0 0-.07.408c.06.14.192.225.342.225 3.108 0 5.438-1.49 6.59-2.41C8.499 20.668 10.2 21 12 21c6.628 0 12-4.364 12-9.75S18.628 1.5 12 1.5Z"
    />
  </Svg>
);
export default SvgComponent;
