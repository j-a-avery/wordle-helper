const TrieNode = require("../src/TrieNode");

const a = "a";
const b = "b";
const c = "c";

test("A new TrieNode created with a letter should have a letter property equal to that letter.", () => {
  expect(new TrieNode(a).letter).toBe(a);
});

test("A new TrieNode should have an empty next object", () => {
  expect(new TrieNode(a).next).toStrictEqual({});
});

test("A new TrieNode should not be a word boundary", () => {
  expect(new TrieNode(a).wordBoundary).toBe(false);
});

test("A new TrieNode should not be pruned", () => {
  expect(new TrieNode(a).pruned).toBe(false);
});

const rootNode = new TrieNode(TrieNode.ROOT_NODE);

test("A new root node's letter should be ROOT_NODE", () => {
  expect(rootNode.letter).toBe(TrieNode.ROOT_NODE);
});

rootNode.next["a"] = new TrieNode("a");
rootNode.next["b"] = new TrieNode("b");

test("A node with child nodes can prune a child node", () => {
  expect(rootNode.pruneChild("a").next["a"].pruned).toBe(true);
});

test("A node with child nodes only prunes the expected child node", () => {
  expect(rootNode.next["b"].pruned).toBe(false);
});

test("A node can be unpruned", () => {
  expect(rootNode.unpruneChild("a").next["a"].pruned).toBe(false);
});
