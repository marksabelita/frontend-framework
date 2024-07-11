import { removeEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";

export function unmountDOM(vdom) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      removeTextNode(vdom);
      break;
    case DOM_TYPES.ELEMENT:
      removeElementNode(vdom);
      break;
    case DOM_TYPES.FRAGMENT:
      removeFragmentNode(vdom);
      break;
    default:
      throw new Error(`Can't destroy DOM of type ${type}`);
  }

  delete vdom.el;
}

export function removeTextNode(vdom) {
  const { el } = vdom;
  el.remove();
}

export function removeElementNode(vdom) {
  const { el, children, listeners } = vdom;
  if (el instanceof HTMLElement) el.remove();

  children.forEach(unmountDOM);
  if (listeners) {
    removeEventListeners(el, listeners);
    delete vdom.listeners;
  }

  delete vdom.children;
}

export function removeFragmentNode(vdom) {
  const { el, children } = vdom;
  if (el instanceof HTMLElement) children.forEach(unmountDOM);
}
