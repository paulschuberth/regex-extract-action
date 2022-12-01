export async function extractor(
  haystack: string,
  needle = /[A-Z]+-\d+/gim
): Promise<string[]> {
  return new Promise(resolve => {
    const matches = haystack.match(needle) ?? []
    const uniques = [...new Set(matches)]
    resolve(uniques)
  })
}
