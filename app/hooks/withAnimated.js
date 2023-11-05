import React from 'react';
import Animated from 'react-native-reanimated';

export default (WrappedComponent) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class WithAnimated extends React.Component {
    static displayName = `WithAnimated(${displayName})`;

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Animated.createAnimatedComponent(WithAnimated);
};
