import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={35} fill="none" {...props}>
    <Path fill="#F18F64" stroke="#000" d="m8.187 31.256-6.985-2.484 16.84-9.48 3.673 3.868-13.528 8.096Z" />
    <Path fill="#D63E13" stroke="#000" d="M6.936 15.351 3.148 11.24l13.609-7.806 6.913 2.182-16.734 9.735Z" />
    <Path fill="#E66642" stroke="#000" d="m1.49 12.326 4.955-3.335 16.36 13.45-4.956 3.335-16.36-13.45Z" />
  </Svg>
);

export default SvgComponent;
