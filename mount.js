import { DOM_TYPES } from "./h.js";
import { setAttributes } from "./attributes.js";
import { addEventListeners } from "./events.js";

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vdom, parentEl, index);
      break;
    case DOM_TYPES.ELEMENT:
      createElement(vdom, parentEl, index);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragment(vdom, parentEl, index);
      break;
    case DOM_TYPES.COMPONENT:
      createComponentNode(vdom, parentEl, index, hostComponent);
      break;
  }
}

function createComponentNode(vdom, parentEl, index, hostComponent = null) {
  console.log("create component node");
  const Component = vdom.tag;
  const props = vdom.props;
  const component = new Component(props);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}

function createTextNode(vdom, parentEl, index) {
  const textNode = document.createTextNode(vdom.value);
  vdom.el = textNode;

  // parentEl.appendChild(textNode);
  insert(textNode, parentEl, index);
}

function createFragment(vdom, parentEl, index) {
  vdom.el = parentEl;
  vdom.children.forEach((child, i) => {
    mountDOM(child, parentEl, index ? index + i : null);
  });
}

function createElement(vdom, parentEl, index) {
  const { tag, props, children } = vdom;
  const el = document.createElement(tag);
  vdom.el = el;
  addProps(el, props, vdom);

  children.forEach((child) => {
    mountDOM(child, el);
  });

  console.log(el, parentEl, index);
  insert(el, parentEl, index);
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(el, events);
  setAttributes(el, attrs);
}

function insert(el, parentEl, index) {
  if (index == null) {
    parentEl.appendChild(el);
  }

  if (index < 0) {
    throw new Error(`Index must be possible, got ${index}`);
  }

  const children = el.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    console.log(el, children[0]);
    console.log(el);
    parentEl.insertBefore(el, children[index]);
  }
}
