import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" {...props}>
    <Path
      fill={props.color || '#000'}
      fillRule="evenodd"
      d="M17.804 4.07a.784.784 0 0 0 0-1.138l-1.962-1.89a.858.858 0 0 0-1.183 0l-1.643 1.583 3.144 3.029 1.644-1.583Zm-2.482 2.392-3.145-3.03-8.385 8.078v3.029h3.144l8.386-8.077Zm5.24 10.5H.438v3.23h20.125v-3.23Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
