import * as React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={393} height={128} fill="none" {...props}>
    <Path
      fill="#5A4F31"
      d="M97.424 14.314-3 27v93l6.772-1.644a231.001 231.001 0 0 1 77.989-5.323l46.829 4.787a216.981 216.981 0 0 0 42.671.144l53.094-5.063a340.037 340.037 0 0 1 81.544 2.051L395 128V0l-72.191 15.022a366.999 366.999 0 0 1-115.978 5.376l-56.894-6.429a221.003 221.003 0 0 0-52.513.345Z"
    />
    <Ellipse cx={65.865} cy={123} fill="#C7B084" rx={21.267} ry={5} />
    <Ellipse cx={297.779} cy={88} fill="#C7B084" rx={21.267} ry={5} />
    <Ellipse cx={117.514} cy={45} fill="#C7B084" rx={21.267} ry={5} />
  </Svg>
);
export default SvgComponent;
