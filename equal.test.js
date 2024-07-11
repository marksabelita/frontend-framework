import { h, hString } from "./h.js";
import { areNodesEqual } from "./nodes-equal.js";

describe("Test are nodes equal", () => {
  test("test hstring node should return false when new type is not the same", () => {
    const nodeOne = hString("test");
    const nodeTwo = h("h1", {}, ["test"]);
    const nodesAreEqual = areNodesEqual(nodeOne, nodeTwo);

    expect(nodesAreEqual).toBe(false);
  });

  test("test hstring node should return true when new type is same even though value is different", () => {
    const nodeOne = hString("test");
    const nodeTwo = hString("test2");
    const nodesAreEqual = areNodesEqual(nodeOne, nodeTwo);

    expect(nodesAreEqual).toBe(true);
  });

  test("test helement node should return false when new tag is not the same", () => {
    const nodeOne = h("h2", {}, ["test"]);
    const nodeTwo = h("h1", {}, ["test"]);
    const nodesAreEqual = areNodesEqual(nodeOne, nodeTwo);

    expect(nodesAreEqual).toBe(false);
  });

  test("test h node should return true when new tag is same even though value is different", () => {
    const nodeOne = h("h1", {}, ["test"]);
    const nodeTwo = h("h1", {}, ["test2"]);
    const nodesAreEqual = areNodesEqual(nodeOne, nodeTwo);

    expect(nodesAreEqual).toBe(true);
  });
});
