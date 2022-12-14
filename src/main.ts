import * as core from '@actions/core'
import {extractor, Mode} from './extractor'

export async function run(): Promise<void> {
  try {
    const haystack: string = core.getInput('haystack')
    const mode = core.getInput('mode') as Mode
    const customNeedle: string = core.getInput('needle')

    const matches = await extractor(haystack, {
      needle: new RegExp(customNeedle, 'gmi'),
      mode
    })

    core.startGroup('Inputs')
    core.info(`Haystack: ${haystack}`)
    core.info(`Needle: ${customNeedle}`)
    core.info(`Mode: ${mode}`)
    core.endGroup()

    core.startGroup('Outputs')
    core.info(`Matches: ${matches}`)
    core.endGroup()

    const hasMatches = matches.length > 0
    core.setOutput('has_matches', hasMatches)
    core.setOutput('matches', matches)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
