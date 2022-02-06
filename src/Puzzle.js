const Trie = require("./Trie");

class Puzzle {
  /**
   * @param {string[] | Trie} words
   */
  constructor(words) {
    this.words = undefined;

    if (words instanceof Trie) {
      this.words = words;
    } else {
      this.words = new Trie(words);
    }

    this.excludedLetters = new Set();
    this.misplacedLetters = Array(5)
      .fill(0)
      .map((_) => new Set());
    this.knownLetters = Array(5).fill(undefined);
  }

  /**
   * Unprunes all letters in the trie, restoring it to its original state.
   */
  reset() {
    this.words.reset();
    this.excludedLetters = new Set();
    this.misplacedLetters = Array(5)
      .fill(0)
      .map((_) => new Set());
    this.knownLetters = Array(5).fill(undefined);
  }

  /**
   * Excludes all words containing the specified letters.
   * @param string[] letters
   */
  exclude(letters) {
    // No sense in repeating letters
    letters = new Set(letters.join(""));

    for (const letter of letters) {
      // Don't mistakenly exclude letters that are already known to actually be in the word
      if (
        !new Set(this.misplacedLetters.map((s) => [...s]).flat(Infinity)).has(
          letter
        ) ||
        !this.knownLetters.includes(letter)
      ) {
        this.words.pruneAll(letter);
        this.excludedLetters.add(letter);
      }
    }
  }

  /**
   *
   * @param {number} position
   * @param {string} letter
   */
  misplace(position, letter) {
    this.words.prune(letter, position);
    this.misplacedLetters[position].add(letter);
  }

  /**
   * Marks a certain letter in a certain position as known
   * @param {number} position
   * @param {string} letter
   */
  known(position, letter) {
    this.knownLetters[position] = letter;

    const A = "a".charCodeAt(0);

    const wrongLetters = Array.from(Array(26))
      .map((_, idx) => String.fromCharCode(idx + A))
      .filter((c) => c != letter);

    for (const char of wrongLetters) {
      this.words.prune(char, position);
    }
  }

  /**
   * @returns the word so far, with _ for unknown characters
   */
  wordSoFar() {
    return this.knownLetters.map((s) => (s === undefined ? "_" : s)).join("");
  }

  /**
   *
   * @returns {string[]} All the remaining valid words
   */
  remainingWords() {
    return this.words
      .toArray()
      .filter((w) =>
        [this.misplacedLetters.map((s) => [...s])]
          .flat(Infinity)
          .every((c) => [...w].includes(c))
      );
  }
}

module.exports = Puzzle;
