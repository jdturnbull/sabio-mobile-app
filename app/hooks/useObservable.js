import { useEffect, useRef, useReducer } from 'react';

export default (observable, deps = []) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const value = useRef();
  const subscription = useRef(undefined);

  if (!subscription.current) {
    const newSubscription = observable.subscribe((newValue) => {
      value.current = newValue;

      if (subscription.current) {
        forceUpdate();
      }
    });
    subscription.current = newSubscription;
  }

  useEffect(() => {
    // TODO: Ideally the first time this runs it doesn't bother replacing the subscription

    const newSubscription = observable.subscribe((newValue) => {
      value.current = newValue;

      if (subscription.current) {
        forceUpdate();
      }
    });
    subscription.current.unsubscribe();
    subscription.current = newSubscription;
  }, deps);

  useEffect(() => {
    return () => subscription.current.unsubscribe();
  }, []);

  return value.current;
};
