import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.active ? '#fff' : '#ffffff60'}
      d="M5.208 14.25c.628.586 1.58.586 2.16 0l2.382-2.377 2.69 2.69c.291.292.676.437 1.06.437s.768-.146 1.06-.44l7.19-7.19a1.5 1.5 0 0 0-2.12-2.121L13.5 11.38l-2.69-2.69a1.5 1.5 0 0 0-2.122 0l-3.48 3.44c-.544.582-.544 1.533 0 2.119ZM22.5 19.5H3V2.958C3 2.172 2.328 1.5 1.5 1.5S0 2.172 0 2.958V21c0 .825.675 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5Z"
    />
  </Svg>
);
export default SvgComponent;
