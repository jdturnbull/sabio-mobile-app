import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={31} fill="none" {...props}>
    <Path
      fill="#FF912D"
      d="M25 .233v1.922h-1.923V4.08H25V31H1.925S.002 31 .002 29.077V3.135l-.001-.017C-.033 1.815.777.893 1.496.574c.71-.348 1.31-.337 1.39-.34H25ZM2.883 4.08h18.271V2.155H2.886c-.002.006-.03-.002-.143.019-.11.018-.263.057-.388.12-.244.164-.398.202-.43.824.014.48.129.585.261.714.139.121.386.204.557.23a.837.837 0 0 0 .14.017Zm.965 24.998h19.23V6.002H3.847v23.075Z"
    />
    <Path
      fill="#FF912D"
      d="M5.769 21.386v-1.923h11.537v1.923H5.77ZM5.769 13.693v-1.922h15.383v1.922H5.77ZM5.769 17.54v-1.923h15.383v1.923H5.77Z"
    />
  </Svg>
);
export default SvgComponent;
