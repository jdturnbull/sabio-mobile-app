import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" {...props}>
    <G fill="#fff" fillOpacity={0.9} clipPath="url(#a)">
      <Path d="M18.564.688v1.374h-1.375v1.376h1.375v19.25h-16.5s-1.375 0-1.375-1.375V2.75c-.025-.932.554-1.59 1.068-1.82.508-.248.937-.24.994-.243h15.813ZM2.749 3.438H15.814V2.062H2.75c-.001.004-.022-.002-.102.013a1.04 1.04 0 0 0-.278.086c-.174.117-.284.144-.307.589.01.344.092.419.187.51a.874.874 0 0 0 .398.165.6.6 0 0 0 .1.013Zm.69 17.875h13.75v-16.5H3.439v16.5Z" />
      <Path d="M4.813 15.813v-1.376h8.25v1.376h-8.25ZM4.813 10.313V8.937h11v1.376h-11ZM4.813 13.063v-1.376h11v1.376h-11Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h22v22H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
