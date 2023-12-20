import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={34} height={34} fill="none" {...props}>
    <Path
      fill="#FF912D"
      d="M17 0C7.607 0 0 7.607 0 17c0 9.392 7.607 17 17 17 9.392 0 17-7.608 17-17 0-9.393-7.608-17-17-17Zm0 5.1c2.814 0 5.1 2.287 5.1 5.1 0 2.822-2.287 5.1-5.1 5.1a5.099 5.099 0 0 1-5.1-5.1c0-2.813 2.287-5.1 5.1-5.1Zm0 24.14c-4.258 0-7.998-2.176-10.2-5.474.043-3.374 6.808-5.236 10.2-5.236 3.392 0 10.149 1.861 10.2 5.236-2.201 3.298-5.941 5.474-10.2 5.474Z"
    />
  </Svg>
);
export default SvgComponent;
