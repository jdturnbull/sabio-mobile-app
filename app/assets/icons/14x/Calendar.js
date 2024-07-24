import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      fillRule="evenodd"
      d="M11.083 1.75H10.5V.583H9.333V1.75H4.667V.583H3.5V1.75h-.583c-.648 0-1.161.525-1.161 1.167l-.006 8.166c0 .642.52 1.167 1.167 1.167h8.166a1.17 1.17 0 0 0 1.167-1.167V2.917a1.17 1.17 0 0 0-1.167-1.167Zm-1.44 4.702-.619-.619L6.178 8.68 4.94 7.443l-.619.619 1.856 1.855 3.465-3.465Zm-6.726 4.631h8.166V4.667H2.917v6.416Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
