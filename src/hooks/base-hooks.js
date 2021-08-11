import { useState, useEffect, useCallback, useRef } from 'react';

export function useBool(initVal = false) {
  const [state, setState] = useState(initVal);
  function setTrue() {
    setState(true);
  }
  function setFalse() {
    setState(false);
  }
  function toggle() {
    setState(!state);
  }
  return {
    state,
    setTrue,
    setFalse,
    toggle
  }
}

export function useUpdateEffect(effect, deps) {
  const isMounted = useRef(false);
  useEffect(function () {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
}

export function useRequest(request, {
  manual = false
}) {
  const unmounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const run = useCallback(() => {
    setLoading(true);
    return request().finally(() => {
      console.log(unmounted);
      !unmounted.current && setLoading(false);
    })
  }, [request])
  useEffect(() => {
    if(!manual) {
      run();
    }
    return () => unmounted.current = true;
  }, [manual, run])
  return {
    loading,
    run
  }
}

