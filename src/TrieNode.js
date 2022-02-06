// This could be anything (and in TypeScript will be different.)
class RootNode {
  constructor() {
    this.ROOT_NODE = ["ROOT_NODE"];
  }
}
const ROOT_NODE = new RootNode();

/**
 * A node in a Trie
 *
 */
class TrieNode {
  /**
   *
   * @param {string | typeof ROOT_NODE} letter
   */
  constructor(letter) {
    this.letter = letter;
    this.next = {};
    this.wordBoundary = false;
    this.pruned = false;
  }

  /**
   * Prunes a child node from among the node's children.
   * In order to allow pruning actions to be undone,
   * this merely sets the pruned property to true,
   * rather than deleting the child.
   * @param letter - the child node to be pruned
   */
  pruneChild(letter) {
    if (this.next[letter]) {
      this.next[letter].pruned = true;
    }

    return this;
  }

  /**
   * Un-prunes a child node from among the node's children.
   * @param letter - the child node to be re-enabled
   */
  unpruneChild(letter) {
    if (this.next[letter]) {
      this.next[letter].pruned = false;
    }

    return this;
  }
}

module.exports = TrieNode;
module.exports.ROOT_NODE = ROOT_NODE;
