const fs = require("fs");

const prompt = require("prompt-sync")({
  sigint: true,
  eot: true,
});

const Puzzle = require("./Puzzle");
const Trie = require("./Trie");

// TODO: Make this a configurable command line argument
// (or not, since this is a demo/test script)
const path = "data/answers.txt";

fs.readFile(path, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const words = new Trie([...data.split("\n")].map((s) => s.trim()));
  const puzzle = new Puzzle(words);

  repl(puzzle);
});

/**
 *
 * @param {Puzzle} puzzle
 */
function repl(puzzle) {
  let previousCommand = "help";

  do {
    // Initial output
    const remainingWords = puzzle.remainingWords();
    const numRemaining = remainingWords.length;

    let message = "Known so far: " + puzzle.wordSoFar() + "\n";

    // TODO: Add known misplaced letters to the message
    message += puzzle.misplacedLetters
      .map((s, i) => [i, [...s].join(", ")])
      .filter(([i, s]) => s !== "")
      .map(([i, s]) => `  Position ${i + 1} is not: ${s}`)
      .join("\n");

    if (puzzle.excludedLetters.size > 0) {
      message +=
        "\n  Letters not in the word: " +
        [...puzzle.excludedLetters].join(", ");
    }

    console.log(message);

    if (numRemaining == 0) {
      console.log("All possible words have been eliminated.");
      console.log('Start over with the "restart" command.\n');
    } else if (numRemaining == 1) {
      console.log("There is only 1 word remaining.\n");
    } else {
      console.log(`There are ${numRemaining} possible words remaining.\n`);
    }

    // Suggest a random word
    // Prefer words with five unique letters
    wordsWithAllUniqueLetters = puzzle
      .remainingWords()
      .filter(
        (w) => [...w].sort().join("") === [...new Set(w)].sort().join("")
      );

    let guess;
    if (wordsWithAllUniqueLetters.length > 0) {
      guess =
        wordsWithAllUniqueLetters[
          Math.floor(Math.random() * wordsWithAllUniqueLetters.length)
        ];
    } else {
      guess =
        puzzle.remainingWords()[
          Math.floor(Math.random() * puzzle.remainingWords().length)
        ];
    }

    console.log("\nMaybe try... " + guess);

    // Input command
    [command, ...args] = prompt("> ")
      .toLowerCase()
      .split(/\W/g)
      .filter((s) => s != "");

    let position, letter;

    switch (command) {
      case "exclude":
        // Exclude a letter known not to be in the word
        puzzle.exclude(args);
        break;

      case "misplaced":
        // Mark a letter as known to be in the word, but not in that spot
        [position, letter] = args;
        position = parseInt(position) - 1;
        puzzle.misplace(position, letter);
        break;

      case "known":
        // Mark a letter  that is known to be in a certain position
        [position, letter] = args;
        position = parseInt(position) - 1;
        puzzle.known(position, letter);
        break;

      case "list":
        console.log(remainingWords.join(" "));
    }

    previousCommand = [command];
  } while (true);
}
