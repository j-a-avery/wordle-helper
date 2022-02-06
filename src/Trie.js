const TrieNode = require("./TrieNode");

class Trie {
  constructor(initialWords = undefined) {
    this.root = new TrieNode(TrieNode.ROOT_NODE);

    if (initialWords !== undefined) {
      this.addAll(initialWords);
    }
  }

  /**
   * Adds a word to a trie
   *
   * @param word the word to be added to the trie
   */
  add(word) {
    let current = this.root;

    for (const char of word) {
      // Make sure a node exists for the next character
      if (!current.next[char]) {
        current.next[char] = new TrieNode(char);
      }

      // advance to the next node
      current = current.next[char];
    }

    // Finished traversing the word, so now we're at a word boundary
    current.wordBoundary = true;

    return this;
  }

  /**
   * Adds multiple words to a trie
   * @param words an iterable of words to add to the trie
   */
  addAll(words) {
    for (const word of words) {
      this.add(word);
    }

    return this;
  }

  /**
   * Prunes all occurrences of letter that occur at depth
   * @param letter The character to be pruned from the trie
   * @param depth The 0-indexed depth at which to prune the letter
   */
  prune(letter, depth) {
    function _prune(node, letter, depth) {
      if (depth == 0) {
        node.pruneChild(letter);
      } else {
        for (const char of Object.keys(node.next)) {
          _prune(node.next[char], letter, depth - 1);
        }
      }
    }

    _prune(this.root, letter, depth);
    return this;
  }

  unprune(letter, depth) {
    function _unprune(node, letter, depth) {
      if (depth == 0) {
        node.unpruneChild(letter);
      } else {
        for (const char of Object.keys(node.next)) {
          _unprune(node.next[char], letter, depth - 1);
        }
      }
    }

    _unprune(this.root, letter, depth);
    return this;
  }

  /**
   * Recursively prunes all occurrences of a letter that occur at any depth
   * @param letter The letter to be banished from the trie
   */
  pruneAll(letter) {
    function _pruneall(node, letter) {
      node.pruneChild(letter);

      for (const char of Object.keys(node.next)) {
        _pruneall(node.next[char], letter);
      }
    }

    _pruneall(this.root, letter);
    return this;
  }

  unpruneAll(letter) {
    function _unpruneall(node, letter) {
      node.unprune(letter);

      for (const char of Object.keys(node.next)) {
        _unpruneall(node.next[char], letter);
      }
    }

    _unpruneall(this.root, letter);
    return this;
  }

  /**
   * Unprunes all branches of the tree
   */
  reset() {
    function _reset(node) {
      node.pruned = false;

      for (const char of Object.keys(node.next)) {
        _reset(node.next[char]);
      }
    }

    _reset(this.root);
    return this;
  }

  /**
   *
   * @param word the word to find in the tire
   * @returns true if the word exists in the Trie, false otherwise
   */
  includes(word) {
    let current = this.root;

    for (const char of word) {
      // If the current character is not in the next level of the trie,
      // then the word is not in the trie
      if (!current.next[char] || current.next[char].pruned) {
        return false;
      }

      // Move on to the next level
      current = current.next[char];
    }

    // Finished traversing the word
    return current.wordBoundary;
  }

  /**
   * Yes, this really should be somthing that returns an iterator instead. No, I'm not going to do that yet.
   * @returns An array of words that exist in the trie
   */
  toArray() {
    let words = [];

    function _traverse(node, wordSoFar, wordsFound) {
      if (node.wordBoundary) {
        wordsFound.push(wordSoFar);
      }

      for (const char of Object.keys(node.next)) {
        if (!node.next[char].pruned) {
          _traverse(node.next[char], wordSoFar + char, wordsFound);
        }
      }
    }

    _traverse(this.root, "", words);
    return words;
  }

  /**
   * @returns a string representation of the Trie
   */
  toString() {
    const words = this.toArray();
    const remaining = words.length - 10;

    if (remaining <= 0) {
      return `Trie of [${words.join(", ")}]`;
    } else {
      return `Trie of [${words.slice(0, 10).join(", ")}.. plus ${
        words.length - 10
      } more word${remaining > 1 ? "s" : ""}]`;
    }
  }
}

module.exports = Trie;
