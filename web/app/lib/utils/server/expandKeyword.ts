export function expandKeyword(word: string) {
  const prefixes = [];
  for (let i = 1; i <= word.length; i++) {
    prefixes.push(word.slice(0, i));
  }
  return prefixes;
}