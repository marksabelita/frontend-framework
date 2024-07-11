export function objectDiffs(oldObj, newObj) {
  const newObjectKeys = Object.keys(newObj);
  const oldObjectKeys = Object.keys(oldObj);

  return {
    added: newObjectKeys.filter((k) => !oldObjectKeys.includes(k)),
    removed: oldObjectKeys.filter((k) => !newObjectKeys.includes(k)),
    updated: newObjectKeys.filter(
      (k) => k in oldObj && oldObj[k] !== newObj[k],
    ),
  };
}

export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
