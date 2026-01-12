export function onlyFinalKeywords(keywords: string[]): string[] {
  const sorted = [...keywords].sort((a, b) => a.length - b.length)

  return sorted.filter((word, index) => {
    return !sorted.some((other, i) => {
      return i !== index && other.length > word.length && other.startsWith(word)
    })
  })
}