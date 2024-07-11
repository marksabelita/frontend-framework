import { mountDOM } from "./mount.js";
import { unmountDOM } from "./unmount.js";
import { patchDOM } from "./patch.js";
import { Dispatcher } from "./dispatcher.js";

export function createApp({ state, view, reducers }) {
  let parentEl = null;
  let vdom = null;
  const dispatcher = new Dispatcher();
  const subsriptions = [dispatcher.afterEveryCommand(renderApp)];

  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });

    subsriptions.push(subs);
  }

  function renderApp() {
    const newVdom = view(state, emit);
    vdom = patchDOM(vdom, newVdom, parentEl, this);
  }

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl;
      vdom = view(state, emit);
      mountDOM(vdom, parentEl);
      return this;
    },
    unmount() {
      unmountDOM(vdom);
      vdom = null;
      subsriptions.forEach((unsub) => unsub());
    },
  };
}
