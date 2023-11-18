import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none" {...props}>
    <Path
      fill="#fff"
      fillOpacity={props.selected ? 0.6 : 0.2}
      d="M15.69 10a1.25 1.25 0 0 0 0 2.5h5a1.25 1.25 0 1 0 0-2.5h-5ZM15.69 21.25a1.25 1.25 0 0 0 0 2.5h5a1.25 1.25 0 1 0 0-2.5h-5Z"
    />
    <Path
      fill="#fff"
      fillOpacity={props.selected ? 0.8 : 0.2}
      d="M15.69 6.25a1.25 1.25 0 0 0 0 2.5h10a1.25 1.25 0 1 0 0-2.5h-10ZM15.69 17.5a1.25 1.25 0 0 0 0 2.5h10a1.25 1.25 0 1 0 0-2.5h-10Z"
    />
    <Path
      fill="#fff"
      fillOpacity={props.selected ? 0.9 : 0.3}
      d="M4.31 5.003c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h6.25c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25H4.31ZM4.31 16.247c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h6.25c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25H4.31Z"
    />
  </Svg>
);
export default SvgComponent;
