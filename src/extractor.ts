interface ExtractorOptions {
  mode?: Mode
  needle?: RegExp
}

export async function extractor(
  haystack: string,
  options?: ExtractorOptions
): Promise<string[]> {
  return new Promise(resolve => {
    const needle = options?.needle ?? JIRA_ISSUE
    const matches = haystack.match(needle) ?? []
    const mode = options?.mode ?? 'unique'

    if (mode === 'first') {
      const firstMatch = matches[0]
      if (firstMatch) {
        resolve([firstMatch])
      } else {
        resolve([])
      }
      return
    }

    if (mode === 'all') {
      resolve(matches)
      return
    }

    // Default
    const uniques = [...new Set(matches)]
    resolve(uniques)
  })
}

export type Mode = 'unique' | 'all' | 'first'

export const JIRA_ISSUE = /[A-Z]+-\d+/gim
