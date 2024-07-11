import { objectDiffs } from "./objects";

describe("Test Objects", () => {
  test("Added length should be one when new item does not exist in previous object", () => {
    const oldObject = {
      a: 1,
      b: 2,
    };

    const newObject = {
      a: 1,
      b: 2,
      c: 3,
    };

    const { added } = objectDiffs(oldObject, newObject);

    expect(added.length).toBe(1);
    expect(added).toEqual(["c"]);
  });

  test("Remvoed length should be one when old item does not exist in new object", () => {
    const newObject = {
      a: 1,
      b: 2,
    };

    const oldObject = {
      a: 1,
      b: 2,
      c: 3,
    };

    const { removed } = objectDiffs(oldObject, newObject);

    expect(removed.length).toBe(1);
    expect(removed).toEqual(["c"]);
  });

  test("Updated length should be one when value of old item in index 0 does not match in new objects index 0", () => {
    const newObject = {
      a: 2,
      b: 2,
    };

    const oldObject = {
      a: 1,
      b: 2,
    };

    const { updated } = objectDiffs(oldObject, newObject);

    expect(updated.length).toBe(1);
    expect(updated).toEqual(["a"]);
  });
});
