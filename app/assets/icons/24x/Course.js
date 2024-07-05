import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="M22 4c0 1.3-.827 2.889-1.613 4.105a1.627 1.627 0 0 1-2.774 0C16.827 6.89 16 5.3 16 4a3 3 0 1 1 6 0ZM8 18c0 1.3-.827 2.889-1.613 4.105a1.627 1.627 0 0 1-2.774 0C2.827 20.89 2 19.3 2 18a3 3 0 1 1 6 0Zm2.1-13a4.1 4.1 0 1 0 0 8.2h6a1.9 1.9 0 0 1 0 3.8H11a1 1 0 1 0 0 2h5.1a3.9 3.9 0 0 0 0-7.8h-6a2.1 2.1 0 1 1 0-4.2H14a1 1 0 1 0 0-2h-3.9Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
