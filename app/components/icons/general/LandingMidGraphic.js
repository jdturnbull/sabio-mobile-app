import * as React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={393} height={128} fill="none" {...props}>
    <Path
      fill="#FFE896"
      d="M98.504 14.398 0 27v93l5.744-1.412a230.984 230.984 0 0 1 78.94-5.453l44.717 4.629a216.996 216.996 0 0 0 43.208.149L223.47 113a339.966 339.966 0 0 1 82.565 2.103L393 128V0l-69.862 14.723a367.003 367.003 0 0 1-117.407 5.508l-54.056-6.186a220.997 220.997 0 0 0-53.17.353Z"
    />
    <Ellipse cx={68} cy={123} fill="#FFAC0A" fillOpacity={0.77} rx={21} ry={5} />
    <Ellipse cx={297} cy={88} fill="#FFBF42" rx={21} ry={5} />
    <Ellipse cx={119} cy={45} fill="#FFBF42" rx={21} ry={5} />
  </Svg>
);
export default SvgComponent;
