const RootNode = ["ROOT_NODE"];

class TrieNode {
  constructor(letter) {
    this.letter = letter;
    this.next = {};
    this.wordBoundary = false;
  }

  prune(letter) {
    if (this.next[letter]) {
      delete this.next[letter];
    }
  }
}

class Trie {
  constructor(initialWords = undefined) {
    this.root = new TrieNode(RootNode);

    if (initialWords !== undefined) {
      for (const word of initialWords) {
        this.add(word);
      }
    }
  }

  add(word) {
    let current = this.root;

    for (const char of word) {
      if (!current.next[char]) {
        current.next[char] = new TrieNode(char);
      }

      current = current.next[char];
    }

    current.wordBoundary = true;

    return this;
  }

  addAll(words) {
    for (const word of words) {
      this.add(word);
    }
  }

  prune(letter, depth) {
    function _prune(node, letter, depth) {
      if (depth == 0) {
        node.prune(letter);
      } else {
        for (const char of Object.keys(node.next)) {
          _prune(node.next[char], letter, depth - 1);
        }
      }
    }

    _prune(this.root, letter, depth);
    return this;
  }

  pruneAll(letter) {
    function _pruneall(node, letter) {
      node.prune(letter);

      for (const char of Object.keys(node.next)) {
        _pruneall(node.next[char], letter);
      }
    }

    _pruneall(this.root, letter);
    return this;
  }

  includes(word) {
    let current = this.root;

    for (const char of word) {
      if (!current.next[char]) {
        return false;
      }

      current = current.next[char];
    }

    return current.wordBoundary;
  }

  toArray() {
    let words = [];

    function _traverse(node, wordSoFar, wordsFound) {
      if (node.wordBoundary) {
        wordsFound.push(wordSoFar);
      }

      for (const char of Object.keys(node.next)) {
        _traverse(node.next[char], wordSoFar + char, wordsFound);
      }
    }

    _traverse(this.root, "", words);
    return words;
  }

  toString() {
    const words = this.toArray();
    const remaining = words.length - 10;

    if (remaining <= 0) {
      return `Trie of [${words.join(", ")}]`;
    } else {
      return `Trie of [${words.slice(0, 10).join(", ")}... plus ${
        words.length - 10
      } more word${remaining > 1 ? "s" : ""}]`;
    }
  }
}

module.exports = Trie;
