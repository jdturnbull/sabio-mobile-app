import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={22} fill="none" {...props}>
    <Path
      fill={props.color ? props.color : '#000'}
      d="M7.5 21.5A7.5 7.5 0 0 0 15 14c0-.866-.23-1.697-.5-2.47-1.667 1.648-2.933 2.47-3.8 2.47 3.995-7 1.8-10-4.2-14C7 5 3.704 7.274 2.36 8.537A7.5 7.5 0 0 0 7.5 21.501Zm.71-17.765c3.24 2.75 3.257 4.887.753 9.274-.761 1.333.202 2.992 1.737 2.992.688 0 1.384-.2 2.119-.595A5.501 5.501 0 1 1 3.73 9.993c.127-.118.766-.685.794-.71.424-.38.773-.717 1.118-1.086 1.23-1.318 2.115-2.78 2.567-4.462Z"
    />
  </Svg>
);
export default SvgComponent;
