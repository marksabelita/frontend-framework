function setClass(el, className) {
  el.className = className;
}

export function setAttributes(el, attrs) {
  const { style, class: className, otherAttrs } = attrs;

  if (className) {
    setClass(el, className);
  }

  if (otherAttrs) {
    for (const [key, value] of Object.entries(otherAttrs)) {
      el.setAttribute(key, value);
    }
  }
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}

export function setAttribute(el, name, value) {
  if (value == null) {
    removeAttribute(el, name);
  } else if (name.startsWith("data-")) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
}
