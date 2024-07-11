import {
  ARRAY_DIFF_OPS,
  ArrayWithOriginalIndices,
  arraysDiffSequence,
} from "./arrays.js";

// arraysDiffSequence(oldArray, newArray);
describe("Test ArrayWithOriginalIndices remove", () => {
  test("Item in index 0 is removed, operations is removed, array length should be 3", () => {
    const oldArray = [1, 2, 3, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);

    const index = 0;
    const toRemoveItem = array.isRemove(index, [5, 2, 3, 4]);
    const expectedOperation = array.removeItem(index);
    expect(toRemoveItem).toBe(true);
    expect(expectedOperation.operation).toBe(ARRAY_DIFF_OPS.REMOVE);
    expect(array.length).toBe(3);
  });

  test("Item in index 0 is not removed, and array lenght should still be 4", () => {
    const oldArray = [1, 2, 3, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);
    const toRemoveItem = array.isRemove(0, [4, 3, 2, 1]);
    expect(toRemoveItem).toBe(false);
    expect(array.length).toBe(4);
  });

  test("Item is index 0 is not remove, operation is noop and array lenght should still be 4", () => {
    const oldArray = [1, 2, 3, 5];
    const newArray = [1, 2, 3, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);

    const index = 0;
    const noOpItem = array.isNoop(index, newArray);
    const expectedOperation = array.noopItem(index);
    expect(noOpItem).toBe(true);
    expect(expectedOperation.operation).toBe(ARRAY_DIFF_OPS.NOOP);

    expect(array.length).toBe(4);
  });

  test("Item in index 1 should return originalIndex: 0 and newIndex: 1 when first item is deleted", () => {
    const oldArray = [5, 3, 2, 3, 1];
    const newArray = [1, 2, 3, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);

    const index = 0;
    const toRemoveItem = array.isRemove(0, newArray);
    expect(toRemoveItem).toBe(true);
    const expectedDeleteOperation = array.removeItem(0);
    expect(expectedDeleteOperation.operation).toBe(ARRAY_DIFF_OPS.REMOVE);

    const noOpItem = array.isNoop(1, newArray);
    const expectedOperation = array.noopItem(index);
    expect(noOpItem).toBe(true);
    expect(expectedOperation.operation).toBe(ARRAY_DIFF_OPS.NOOP);
    expect(array.length).toBe(4);
  });

  test("Item in index 0 should be added, operation is added and array length should be 5", () => {
    const oldArray = [1, 2, 3, 4];
    const newArray = [1, 2, 5, 3, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);

    const index = 2;
    const toAddItem = array.isAdd(index, newArray[index]);
    expect(toAddItem).toBe(true);

    const expectedOperation = array.addItem(index, newArray[index]);
    expect(expectedOperation.operation).toBe(ARRAY_DIFF_OPS.ADD);
    expect(array.length).toBe(5);
  });

  test("Item in index 0 should be moved to index 2, operation is moved and array length should remain 4", () => {
    const oldArray = [1, 3, 2, 4];
    const newArray = [2, 3, 1, 4];
    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);

    const index = 0;
    const expectedOperation = array.moveItem(index, newArray);

    expect(expectedOperation.originalIndex).toBe(2);
    expect(expectedOperation.newIndex).toBe(0);

    expect(expectedOperation.operation).toBe(ARRAY_DIFF_OPS.MOVE);
    expect(array.arrayData[0]).toBe(2);
    expect(array.length).toBe(4);
  });

  test("Operations length should return 3 and array lenght should be 4", () => {
    const oldArray = [1, 3, 4, 5, 6, 5, 5, 5];
    const newArray = [2, 4, 5, 9, 6];

    const array = new ArrayWithOriginalIndices(oldArray, (a, b) => a === b);
    const expectedOperation = array.removeExcessItems(newArray.length);
    expect(expectedOperation.length).toBe(3);
    expect(array.length).toBe(5);
  });

  test("Array diff sequence", () => {
    const oldArray = [1, 3, 4, 5, 6, 5, 5, 5];
    const newArray = [2, 4, 5, 9, 6];

    const sequence = arraysDiffSequence(oldArray, newArray);
    expect(sequence.length).toBe(10);

    expect(sequence[0].operation).toBe(ARRAY_DIFF_OPS.REMOVE); //i0 2 old 1 does not exist - [1, 3, 4 ...]
    expect(sequence[1].operation).toBe(ARRAY_DIFF_OPS.REMOVE); //i0 2 old 3 does not exist -  [3,4,5,6 ...]
    expect(sequence[2].operation).toBe(ARRAY_DIFF_OPS.ADD); //i1 4 add 2 old does not contain 2 - [2, 4, 5 ....]
    expect(sequence[3].operation).toBe(ARRAY_DIFF_OPS.NOOP); //i2 5 noop since index 2 on old and index 2 on new is same - [2, 4, 5, 6, 5, 5, 5]
    expect(sequence[4].operation).toBe(ARRAY_DIFF_OPS.NOOP); //i3 noop since index 3 on old and index 3 on new is same  - [2, 4, 5, 6, 5, 5, 5]
    expect(sequence[5].operation).toBe(ARRAY_DIFF_OPS.ADD); //i4 old does not contain 9 add [2,4,5,9,6,5,5,5]
    expect(sequence[6].operation).toBe(ARRAY_DIFF_OPS.NOOP); //i5 noop since index 3 on old and index 3 on new is same  - [2,4,5,9,6,5,5,5]
    expect(sequence[7].operation).toBe(ARRAY_DIFF_OPS.REMOVE); //i5 noop since index 3 on old and index 3 on new is same  - [2,4,5,9,6,5,5,]
    expect(sequence[8].operation).toBe(ARRAY_DIFF_OPS.REMOVE); //i5 noop since index 3 on old and index 3 on new is same  - [2,4,5,9,6,5,]
    expect(sequence[9].operation).toBe(ARRAY_DIFF_OPS.REMOVE); //i5 noop since index 3 on old and index 3 on new is same  - [2,4,5,9,6,]
  });
});
