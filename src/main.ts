import * as core from '@actions/core'
import { extractor } from './extractor'


export async function run(): Promise<void> {
  try {

    const haystack: string = core.getInput('haystack')
    let customNeedle: string = core.getInput('needle')

    let matches: string[]
    if (!customNeedle) {
      customNeedle = '[A-Z]+-\d'
      matches = await extractor(haystack)
    } else {
      matches = await extractor(haystack, new RegExp(customNeedle))
    }

    core.setOutput('matches', matches)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
