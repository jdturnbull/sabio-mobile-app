import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={14} height={21} fill="none" {...props}>
    <Path
      fill={props.color ? props.color : '#000'}
      d="M2.864 3.818a3.818 3.818 0 0 1 7.636 0v5.017a6.682 6.682 0 1 1-7.636 0V3.817ZM3.956 10.4a4.773 4.773 0 1 0 5.452 0l-.817-.57V3.818a1.91 1.91 0 1 0-3.818 0V9.83l-.817.57Zm-1.092 3.918H10.5a3.818 3.818 0 1 1-7.636 0Z"
    />
  </Svg>
);
export default SvgComponent;
