import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} fill="none" {...props}>
    <Path
      fill="#8AA1B150"
      d="M13.5 2.25C7.312 2.25 2.25 7.313 2.25 13.5c0 6.188 5.063 11.25 11.25 11.25 6.188 0 11.25-5.063 11.25-11.25 0-6.188-5.063-11.25-11.25-11.25Zm5.512 15.188-1.575 1.575-3.937-3.938-3.938 3.938-1.574-1.576 3.937-3.937-3.938-3.938 1.575-1.574 3.938 3.937 3.938-3.938 1.575 1.575-3.938 3.938 3.938 3.938Z"
    />
  </Svg>
);
export default SvgComponent;
