import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color || '#f8f8f8'}
      d="M13.663 21.09a.703.703 0 0 1-.632-.395l-3.304-6.793-6.794-3.304a.704.704 0 0 1 .047-1.285L20.413 2.3a.703.703 0 0 1 .915.915L14.316 20.65a.704.704 0 0 1-.629.44h-.024Zm-8.69-11.062 5.587 2.72a.703.703 0 0 1 .325.324l2.719 5.587 5.802-14.44-14.433 5.81Z"
    />
    <Path
      fill={props.color || '#f8f8f8'}
      d="M10.252 14.079a.703.703 0 0 1-.496-1.2L20.178 2.455a.703.703 0 0 1 .994.994L10.75 13.875a.703.703 0 0 1-.498.204Z"
    />
  </Svg>
);
export default SvgComponent;
