import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      d="M9.365 16.666c-.39 0-.696-.114-.918-.342-.221-.228-.332-.55-.332-.967V4.537H4.893c-.345 0-.625-.094-.84-.283-.209-.195-.313-.456-.313-.781 0-.326.104-.583.313-.772.215-.195.495-.293.84-.293h8.955c.345 0 .621.098.83.293.215.189.322.446.322.772 0 .325-.107.586-.322.78-.215.19-.492.284-.83.284h-3.223v10.82c0 .417-.114.74-.342.967-.221.228-.527.342-.918.342Z"
    />
  </Svg>
);
export default SvgComponent;
