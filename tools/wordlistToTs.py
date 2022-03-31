import json;

with open("./data/answers.txt", 'r') as f:
  words = [w.strip() for w in f.readlines()]

numwords = len(words)

words = (
  "export default const words: " + 
  f"string[] = {json.dumps(words)};"
)

with open("./src/wordlist.ts", "w") as f:
  f.write(words)

print(f"Wrote {numwords} words to {'./src/wordlist.js'}.")