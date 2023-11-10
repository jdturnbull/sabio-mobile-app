import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={23} fill="none" {...props}>
    <Path
      fill="#fff"
      fillOpacity={props.selected ? 0.8 : 0.3}
      d="M24.105 11.928c-.259.69-.9 1.134-1.633 1.134h-.597v8.594c0 .431-.35.782-.781.782h-4.688v-5.47a3.91 3.91 0 0 0-3.906-3.905 3.91 3.91 0 0 0-3.906 3.906v5.468H3.906a.782.782 0 0 1-.781-.78v-8.595h-.598A1.73 1.73 0 0 1 .894 11.93a1.732 1.732 0 0 1 .485-1.93l9.124-8.64a2.905 2.905 0 0 1 3.994 0l9.146 8.66c.53.462.72 1.22.462 1.91Z"
    />
  </Svg>
);
export default SvgComponent;
