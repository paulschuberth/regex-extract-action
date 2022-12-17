import * as core from '@actions/core'
import {extractor, JIRA_ISSUE, Mode} from './extractor'

export async function run(): Promise<void> {
  try {
    const haystack: string = core.getInput('haystack')
    let customNeedle: string = core.getInput('needle')

    let mode = core.getInput('mode') as Mode

    let matches: string[]|string
    if (!customNeedle) {
      customNeedle = '[A-Z]+-d'
      matches = await extractor(haystack, { mode: mode })
    } else {
      matches = await extractor(haystack, {needle: new RegExp(customNeedle), mode: mode })
    }

    core.setOutput('matches', matches)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
