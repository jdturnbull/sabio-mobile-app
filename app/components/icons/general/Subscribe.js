import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#fff'}
      d="M22.421 9.39a1.458 1.458 0 0 0-1.162-.99l-5.481-.82L13.31 2.34A1.442 1.442 0 0 0 12 1.5c-.563 0-1.065.323-1.31.841l-2.432 5.22-5.517.84c-.54.082-.985.461-1.162.989-.181.542-.047 1.13.349 1.534l3.99 4.085-.942 5.757a1.488 1.488 0 0 0 .608 1.47c.451.32 1.032.351 1.515.085l4.867-2.718L16.9 22.32a1.42 1.42 0 0 0 1.515-.086c.47-.33.703-.894.608-1.469l-.944-5.764 3.993-4.078c.395-.404.529-.992.348-1.534Z"
    />
  </Svg>
);
export default SvgComponent;
