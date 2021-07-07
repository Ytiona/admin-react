import { useState } from 'react';

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