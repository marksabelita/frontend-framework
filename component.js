import { DOM_TYPES } from "./h.js";
import { mountDOM } from "./mount.js";
import { extractChildren, patchDOM } from "./patch.js";
import { unmountDOM } from "./unmount.js";
import { hasOwnProperty } from "./utils/objects.js";

export function defineComponent({ render, state, ...methods }) {
  class Component {
    #vdom = null;
    #hostEl = null;
    state = null;
    props = null;
    #isMounted = false;

    constructor(props = {}) {
      this.props = props;
      this.state = state ? state(props) : {};
    }

    get elements() {
      if (this.#vdom === null) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        const test = extractChildren(this.#vdom).flatMap((child) => {
          return child.el;
        });

        return test;
      }

      return [this.#vdom.el];
    }

    get firstElement() {
      return this.elements[0];
    }

    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return Array.from(this.#hostEl.childNodes).indexOf(this.firstElement);
      }

      return 0;
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    render() {
      return render.call(this);
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error("Component is already mounted");
      }

      this.#vdom = this.render();
      this.#hostEl = hostEl;

      mountDOM(this.#vdom, hostEl, index, this);
      this.#isMounted = true;
    }

    unmount() {
      this.#isMounted = false;
      unmountDOM(this.#vdom);
      this.#hostEl = null;
      this.#vdom = null;
      this.#isMounted = false;
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Component is not mounted");
      }

      const vdom = this.render();
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      throw new Error(`Method ${methodName} is reserved`);
    }

    Component.prototype[methodName] = methods[methodName];
  }

  return Component;
}
