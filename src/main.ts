import * as core from '@actions/core'
import {extractor, Mode} from './extractor'

export async function run(): Promise<void> {
  try {
    const haystack: string = core.getInput('haystack')
    const mode = core.getInput('mode') as Mode
    let customNeedle: string = core.getInput('needle')

    if (!customNeedle) {
      customNeedle = '[A-Z]+-d'
      const matches = await extractor(haystack, {mode})
      core.setOutput('matches', matches)
    } else {
      const matches = await extractor(haystack, {
        needle: new RegExp(customNeedle),
        mode
      })
      core.setOutput('matches', matches)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
