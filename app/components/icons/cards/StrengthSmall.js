import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
    <Path
      fill="#A4D714"
      fillRule="evenodd"
      d="M13.078 7.104a1 1 0 0 1 0-1.414l1.697-1.697a1 1 0 0 1 1.414 0l1.132 1.131 1.367-1.367a1 1 0 0 1 1.414 0l4.101 4.101a1 1 0 0 1 0 1.414l-1.367 1.368 1.132 1.13a1 1 0 0 1 0 1.415l-1.697 1.697a1 1 0 0 1-1.415 0l-2.51-2.51-5.185 5.185-2.758-2.757 5.185-5.186-2.51-2.51ZM4.546 17.899a1 1 0 0 0 0 1.414l4.101 4.102a1 1 0 0 0 1.414 0l1.367-1.367 1.132 1.13a1 1 0 0 0 1.414 0l1.697-1.696a1 1 0 0 0 0-1.414l-7.778-7.779a1 1 0 0 0-1.414 0L4.78 13.986a1 1 0 0 0 0 1.415l1.132 1.131L4.546 17.9Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
