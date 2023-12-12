import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
    <G fill={props.color || '#fff'} clipPath="url(#a)">
      <Path d="M18.799 12.88c-1.727-3.651-1.462-3.074-1.53-3.271l-1.59-4.622a.991.991 0 0 0-.143-.272L12.306.398a.991.991 0 0 0-1.587 1.187l3.136 4.194 1.116 3.245-7.502 3.549c-.167.058-.769.361-.883 1.086L4.994 26.515a1.322 1.322 0 0 0 2.624.325l1.444-11.66 1.459 1.863 3.013 10.016a1.322 1.322 0 0 0 2.532-.762l-2.924-9.719 3.679-1.864-.927 4.253a.993.993 0 0 0-.02.278l.318 4.69a.991.991 0 1 0 1.979-.134l-.31-4.55 1.084-4.975c.116-.565.007-1.017-.146-1.396ZM20.722 11.842a2.294 2.294 0 1 0 0-4.59 2.294 2.294 0 0 0 0 4.59Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
