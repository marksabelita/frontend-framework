import { areNodesEqual } from "./nodes-equal.js";
import { unmountDOM } from "./unmount.js";
import { mountDOM } from "./mount.js";
import { DOM_TYPES } from "./h.js";
import { objectDiffs } from "./utils/objects.js";
import {
  ARRAY_DIFF_OPS,
  arraysDiff,
  arraysDiffSequence,
} from "./utils/arrays.js";
import { setAttribute, removeAttribute } from "./attributes.js";

function findIndexInParent(parentEl, el) {
  const index = Array.from(parentEl.childNodes).indexOf(el);
  if (index < 0) {
    return null;
  }

  return index;
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectDiffs(oldStyle, newStyle);

  for (const style of removed) {
    removeStyle(el, style);
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style]);
  }
}

function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectDiffs(oldAttrs, newAttrs);

  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

function toClassList(classes = "") {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

function patchClasses(el, oldClass, newClass) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);

  if (removed.length > 0) {
    el.classList.remove(...removed);
  }
  if (added.length > 0) {
    el.classList.add(...added);
  }
}

function patchEvents(el, oldListeners = {}, oldEvents = {}, newEvents = {}) {
  const { removed, added, updated } = objectDiffs(oldEvents, newEvents);
  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]);
  }

  const addedListeners = {};

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el);
    addedListeners[eventName] = listener;
  }

  return addedListeners;
}

function patchElement(oldVdom, newVdom) {
  const el = oldVdom.el;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;

  patchAttrs(el, oldAttrs, newAttrs);

  // const { listeners: oldListeners } = oldVdom;
  // patchClasses(el, oldClass, newClass);
  // patchStyles(el, oldStyle, newStyle);
  // newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents);
}

function patchText(oldVdom, newVdom) {
  const el = oldVdom.el;
  const { value: oldText } = oldVdom;
  const { value: newText } = newVdom;

  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

export function extractChildren(vdom) {
  if (vdom.children === null) {
    return [];
  }

  const children = [];

  if (vdom.children) {
    for (const child of vdom?.children) {
      if (child.type === DOM_TYPES.FRAGMENT) {
        children.push(...extractChildren(child));
      } else {
        children.push(child);
      }
    }
  }

  return children;
}

export function patchChildren(oldVdom, newVdom, hostComponent = null) {
  const parentEl = oldVdom.el;
  const oldChildren = extractChildren(oldVdom);
  const newChildren = extractChildren(newVdom);

  const diffSequence = arraysDiffSequence(
    oldChildren,
    newChildren,
    areNodesEqual,
  );

  for (const sequence of diffSequence) {
    const offset = hostComponent?.offset ?? 0;
    const { index, newIndex, originalIndex, operation, item } = sequence;

    switch (operation) {
      case ARRAY_DIFF_OPS.NOOP: {
        patchDOM(
          oldChildren[originalIndex],
          newChildren[newIndex],
          parentEl,
          hostComponent,
        );
        break;
      }

      case ARRAY_DIFF_OPS.ADD: {
        mountDOM(item, parentEl, index, hostComponent);
        break;
      }

      case ARRAY_DIFF_OPS.REMOVE: {
        unmountDOM(item);
        break;
      }

      case ARRAY_DIFF_OPS.MOVE: {
        const el = oldChildren[from].el;
        const elAtTargetIndex = parentEl.childNodes[index + offset];
        parentEl.insertBefore(el, elAtTargetIndex);
        patchDOM(
          oldChildren[from],
          newChildren[index],
          parentEl,
          hostComponent,
        );

        break;
      }
    }
  }
}

export function patchDOM(oldVdom, newVdom, parentEl, hostComponent = null) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el);
    unmountDOM(oldVdom);
    mountDOM(newVdom, parentEl, index);
    oldVdom = newVdom;
    return newVdom;
  }

  newVdom.el = oldVdom.el;

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom);
      return newVdom;
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom);
      break;
    }
  }

  patchChildren(oldVdom, newVdom, hostComponent);

  return newVdom;
}
