# Wordle Helper

A simple project to practice some things (JavaScript at first, TypeScript later; prefix trees/tries; Angular) and to help me solve Wordle puzzles.

The goal is to have a full web UI (and maybe even host it as a web app, if I can finish beford Wordle's fifteen minutes of fame is up).

For now it has a basic, primitive, barely-functional REPL because

1.  I wanted to be able to use it immediately, but
2.  A more urgent/important project came up.

Version history (mostly for my own edification/memory, because only 0.2.0 and 0.5.0+ have had actual version numbers)
* **0.0.0** &mdash; Python experiments. Very slow. Generated all possible 5<sup>26</sup> five-letter permutations and tested them against Python lists. It was slow.
* **0.1.0** &mdash; Still in Python, but used a Trie
* **0.2.0** &mdash; First version to make it to GitHub. Complete rewrite in JavaScript. Had a REPL.
* **0.3.0** &mdash; Part of the point of this is to learn Angular. But I still don't know Angular, so I didn't get very far.
* **0.4.0** &mdash; Complete rewrite again, this time in TypeScript with Svelte. This one was pretty successful &mdash; I used it to solve Wordle/Dordle/Quordle puzzles every day for months. But there are some experiments I'd like to try that I can't do because the UI and solver are too tightly coupled.
* **0.5.0** &mdash; Iterate on 0.2.0 codebase using lessons learned from 0.4.0.
