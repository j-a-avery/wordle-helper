const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

const Trie = require("./Trie");

// For now, require the data file to be ../data/<something>.txt,
// passed as exactly the first argument
let filename = process.argv[2];

if (filename === undefined) {
  filename = "answers.txt";
}

if (filename.indexOf(".txt") === -1) {
  filename += ".txt";
}

filename = "data/" + filename;

fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  repl(new Trie(data.split("\n")));
});

function repl(words) {
  let exclude = new Set();
  let misplaced = new Set();
  let correct = Array(5).fill(undefined);

  do {
    const possibilities = words
      .toArray()
      .filter((w) =>
        Array.from(misplaced).every((c) => Array.from(w).includes(c))
      );
    const numRemaining = possibilities.length;

    console.log("\n\n");

    let message =
      "Known so far: " +
      correct.map((c) => (c ? c : "_")).join("") +
      " " +
      Array.from(misplaced).join(", ");
    console.log("\n" + message);

    if (numRemaining == 0) {
      console.log("All possible words have been eliminated.");
      console.log(`Start over with the "restart" command.`);
    } else if (numRemaining == 1) {
      console.log(`The only word remaining is ${possibilities[0]}.`);
      console.log(
        `If that's not it, then you can start over with the "restart" command.`
      );
    } else {
      console.log(`There are ${numRemaining} words remaining.`);
      if (numRemaining < 10) {
        console.log(possibilities.join(" "));
      }

      console.log(
        `Maybe try... "${
          possibilities[Math.floor(Math.random() * numRemaining)]
        }"`
      );
    }

    [command, ...args] = prompt("> ")
      .toLowerCase()
      .split(/\W/g)
      .filter((s) => s != "");

    console.log("Command is ", command);
    console.log("Args are: ", args);

    switch (command) {
      case "exclude":
        args = new Set(args.map((s) => s.split("")).flat(Infinity));
        console.log(
          `Excluding ${Array.from(args).join(", ")} from future guesses.`
        );
        for (const char of args) {
          if (!misplaced.has(char) && !correct.includes(char)) {
            words.pruneAll(char);
            exclude.add(char);
          }
        }
        break;
      case "misplaced": {
        let [position, letter] = args;
        position = Math.floor(Number(position)) - 1;

        words.prune(letter, position);
        misplaced.add(letter);

        break;
      }

      case "known": {
        let [position, letter] = args;
        position = Math.floor(Number(position)) - 1;

        correct[position] = letter;

        const wrongLetters = Array.from(Array(26))
          .map((_, idx) => idx + 65)
          .map((i) => String.fromCharCode(i).toLowerCase())
          .filter((c) => c != letter);

        console.log(
          `Excluding letters ${wrongLetters} from position ${position}`
        );

        for (const char of wrongLetters) {
          words.prune(char, position);
        }

        break;
      }
      case "list":
        console.log(possibilities.join(" "));
        break;
      default:
        console.log(`
Possible commands: 
  exclude <letters to exclude>*  -- excludes those letters from future guesses
  misplaced <position> <letter>* -- includes those letters in future guesses
  known <position> <letter>*     -- includes that letters in future guesses, in that position 
  restart*                       -- rebuilds the repl
  list                           -- lists all ${numRemaining} remaining possibilities
  help (or any other command)    -- list this help information
  
  To exit, type Ctrl+C

  * Commands marked with an asterisk are not implemented yet.
        `);
    }
  } while (true);
}
