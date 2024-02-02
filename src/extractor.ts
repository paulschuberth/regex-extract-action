interface ExtractorOptions {
  mode?: Mode
  needle?: RegExp
  until?: RegExp
}

function reduceHaystack(haystack: string, until: RegExp): string {
  const matches = haystack.match(until)
  if (!matches) return haystack

  const firstMatch = matches.at(0) ?? ''
  const index = haystack.indexOf(firstMatch)
  return haystack.substring(0, index)
}

export async function extractor(
  haystack: string,
  options?: ExtractorOptions
): Promise<string[]> {
  return new Promise(resolve => {
    const needle = options?.needle ?? JIRA_ISSUE

    if (options?.until) {
      haystack = reduceHaystack(haystack, options.until)
    }
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
export type ReadMode = 'plain' | 'file'

export const JIRA_ISSUE = /[A-Z]+-\d+/gim
