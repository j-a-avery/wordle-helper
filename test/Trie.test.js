const Trie = require("../src/Trie");
const ROOT_NODE = require("../src/TrieNode").ROOT_NODE;

test("A new Trie should have a root node", () => {
  expect(new Trie().root.letter).toBe(ROOT_NODE);
});

test("A new Trie without any words added should have no children", () => {
  expect(new Trie().root.next).toStrictEqual({});
});

test("A new Trie can have a single-character word added to it.", () => {
  expect(new Trie().add("a").root.next["a"]).not.toStrictEqual({});
});

test("When a single-character word is added to a new Trie, it ends at a word boundary.", () => {
  expect(new Trie().add("a").root.next["a"].wordBoundary).toBe(true);
});

test("A new Trie can have a multi-character word added to it.", () => {
  expect(
    new Trie().add("longer").root.next["l"].next["o"].next["n"].next["g"].next[
      "e"
    ].next["r"].wordBoundary
  ).toBe(true);
});

test("A new Trie can have multiple words added to it.", () => {
  expect(
    Object.keys(new Trie().addAll(["cat", "dog"]).root.next)
  ).toMatchObject(["c", "d"]);
});

test("A Trie can have words added to it at construction time.", () => {
  expect(Object.keys(new Trie(["cat", "dog"]).root.next)).toMatchObject([
    "c",
    "d",
  ]);
});

test("A trie created with multiple words can have another word added to it.", () => {
  expect(
    Object.keys(new Trie(["cat", "dog"]).add("fox").root.next)
  ).toMatchObject(["c", "d", "f"]);
});

test("A trie created with multiple words can have multiple words added to it.", () => {
  expect(
    Object.keys(new Trie(["cat", "dog"]).addAll(["fox", "hog"]).root.next)
  ).toMatchObject(["c", "d", "f", "h"]);
});

test("A trie can return an array of its words; this array is empty for empty tries.", () => {
  expect(new Trie().toArray()).toStrictEqual([]);
});

test("A trie can return an array of its words; this array contains only one item if only one word has been added to the trie.", () => {
  expect(new Trie().add("cat").toArray()).toMatchObject(["cat"]);
});

const words = ["cat", "dog", "fox", "hog", "ocelot"];

test("A trie can return an array of its words; if a trie contains multiple words, all those words will be returned in the array", () => {
  expect(new Trie(words).toArray()).toMatchObject(words);
});

test("A trie can accurately report that it includes a word.", () => {
  expect(new Trie(words).includes("cat")).toBe(words.includes("cat"));
});

test("A trie can accurately report that it does not include a word.", () => {
  expect(new Trie(words).includes("zebra")).toBe(words.includes("zebra"));
});

const t = new Trie(words);

test("Pruning a letter from all positions prunes all words containing that letter", () => {
  expect(new Trie(words).pruneAll("o").toArray()).toMatchObject(["cat"]);
});

test("Pruning a letter from just one position only prunes those words containing that letter at that position", () => {
  expect(new Trie(words).prune("o", 1).toArray()).toMatchObject([
    "cat",
    "ocelot",
  ]);
});

test("A letter can be unpruned.", () => {
  expect(new Trie(words).prune("o", 1).unprune("o", 1).toArray()).toMatchObject(
    words
  );
});

test("A Trie that has had words removed can be reset to contain all the original words.", () => {
  expect(new Trie(words).pruneAll("o").reset().toArray()).toMatchObject(words);
});
