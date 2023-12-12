import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      d="M23.14 12.411a1.662 1.662 0 0 1-1.567 1.089H21v8.25a.75.75 0 0 1-.75.75h-4.5v-5.25A3.754 3.754 0 0 0 12 13.5a3.754 3.754 0 0 0-3.75 3.75v5.25h-4.5a.75.75 0 0 1-.75-.75V13.5h-.574c-.704 0-1.319-.427-1.567-1.088a1.663 1.663 0 0 1 .465-1.853l8.76-8.295a2.789 2.789 0 0 1 3.833 0l8.78 8.315c.509.443.692 1.17.444 1.832Z"
    />
  </Svg>
);
export default SvgComponent;
