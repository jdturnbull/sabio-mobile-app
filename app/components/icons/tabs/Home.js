import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
    <Path
      fill={props.active ? '#E66642' : '#ffffff80'}
      d="M26.997 14.48a1.94 1.94 0 0 1-1.828 1.27H24.5v9.625a.875.875 0 0 1-.875.875h-5.25v-6.125A4.38 4.38 0 0 0 14 15.75a4.38 4.38 0 0 0-4.375 4.375v6.125h-5.25a.875.875 0 0 1-.875-.875V15.75h-.67c-.821 0-1.538-.498-1.828-1.27a1.94 1.94 0 0 1 .542-2.161l10.22-9.677a3.254 3.254 0 0 1 4.473 0l10.243 9.7c.593.517.807 1.366.517 2.137Z"
    />
  </Svg>
);
export default SvgComponent;
