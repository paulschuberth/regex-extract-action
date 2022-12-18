import * as core from '@actions/core'

interface ExtractorOptions {
  mode?: Mode
  needle?: RegExp
}

export function extractor(
  haystack: string,
  options?: ExtractorOptions
): string[] {
  const needle = options?.needle ?? JIRA_ISSUE
  const matches = haystack.match(needle) ?? []
  const mode = options?.mode ?? 'unique'

  core.warning(`Mode: ${mode}`)
  core.warning(`Haystack: ${haystack}`)
  core.warning(`Needle: ${needle}`)
  core.warning(`Matches: ${matches}`)

  if (mode === 'first') {
    const firstMatch = matches[0]
    if (firstMatch) {
      return [firstMatch]
    } else {
      return []
    }
  }

  if (mode === 'all') {
    return matches
  }

  // Default
  const uniques = [...new Set(matches)]
  return uniques
}

export type Mode = 'unique' | 'all' | 'first'

export const JIRA_ISSUE = /[A-Z]+-\d+/gim
