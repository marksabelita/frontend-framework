import { DOM_TYPES } from "./h.js";

export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne?.type !== nodeTwo?.type) {
    return false;
  }

  if (nodeOne?.type === DOM_TYPES.ELEMENT) {
    const { tag: tag1 } = nodeOne;
    const { tag: tag2 } = nodeTwo;

    return tag1 === tag2;
  }

  return true;
}
