export function addEventListeners(el, events = {}, hostComponent = null) {
  let listeners = {};

  Object.entries(events).map(([eventName, handler]) => {
    const listener = el.addEventListener(eventName, handler, el);
    listeners[eventName] = listener;
  });

  return listeners;
}

export function removeEventListeners(el, listeners) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
