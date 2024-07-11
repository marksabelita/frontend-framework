export const ARRAY_DIFF_OPS = {
  REMOVE: "remove",
  ADD: "add",
  MOVE: "move",
  NOOP: "noop",
};

export function withoutNulls(arr) {
  return arr.filter((item) => item != null);
}

export function mapTextNodes() {
  return null;
}

export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((i) => !oldArray.includes(i)),
    removed: oldArray.filter((i) => !newArray.includes(i)),
  };
}

export class ArrayWithOriginalIndices {
  #array = [];
  #originalIndeces = [];
  #equalsFn;

  constructor(array, equalsFn) {
    this.#array = array;
    this.#originalIndeces = array.map((_, l) => l);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  get arrayData() {
    return this.#array;
  }

  isRemove(index, newArray) {
    if (index >= this.length) {
      return false;
    }

    const currentItem = this.#array[index];
    const toRemoveIndex = newArray.findIndex((i) =>
      this.#equalsFn(i, currentItem),
    );
    return toRemoveIndex === -1;
  }

  removeItem(index) {
    const op = {
      operation: ARRAY_DIFF_OPS.REMOVE,
      index: index,
      item: this.#array[index],
    };

    this.#array.splice(index, 1);
    this.#originalIndeces.splice(index, 1);
    return op;
  }

  isNoop(index, newArray) {
    if (index >= this.length) {
      return false;
    }

    return this.#equalsFn(this.#array[index], newArray[index]);
  }

  noopItem(index) {
    return {
      operation: ARRAY_DIFF_OPS.NOOP,
      originalIndex: this.#originalIndeces[index],
      newIndex: index,
      item: this.#array[index],
    };
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i;
      }
    }

    return -1;
  }

  isAdd(index, item) {
    const findIndex = this.findIndexFrom(index, item);
    return findIndex === -1;
  }

  addItem(index, item) {
    const operations = {
      operation: ARRAY_DIFF_OPS.ADD,
      index,
      item,
    };

    this.#array.splice(index, 0, item);
    this.#originalIndeces.splice(index, 0, -1);
    return operations;
  }

  moveItem(index, newArray) {
    const originalIndex = this.#array.findIndex((i) =>
      this.#equalsFn(i, newArray[index]),
    );

    const operation = {
      operation: ARRAY_DIFF_OPS.MOVE,
      originalIndex,
      newIndex: index,
      item: newArray[index],
    };

    const [_item] = this.#array.splice(originalIndex, 1);
    this.#array.splice(index, 0, _item);

    return operation;
  }

  removeExcessItems(index) {
    const operations = [];

    while (this.length > index) {
      operations.push(this.removeItem(index));
    }

    return operations;
  }
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b,
) {
  let sequence = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

  for (let i = 0; i < newArray.length; i++) {
    const isRemove = array.isRemove(i, newArray);

    if (isRemove) {
      sequence.push(array.removeItem(i));
      i--;
      continue;
    }

    const isNoop = array.isNoop(i, newArray);
    if (isNoop) {
      sequence.push(array.noopItem(i));
      continue;
    }

    const isAdd = array.isAdd(i, newArray[i]);
    if (isAdd) {
      sequence.push(array.addItem(i, newArray[i]));
      continue;
    }

    array.moveItem(i, newArray);
  }

  if (array.length > newArray.length) {
    const removeItems = array.removeExcessItems(newArray.length);
    sequence = sequence.concat(removeItems);
  }

  return sequence;
}
