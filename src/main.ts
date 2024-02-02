import * as core from '@actions/core'
import {extractor, Mode, ReadMode} from './extractor'
import {promises as fs} from 'fs'

export async function run(): Promise<void> {
  try {
    let haystack: string = core.getInput('haystack')
    const mode = core.getInput('mode') as Mode
    const readMode = core.getInput('read_mode') as ReadMode
    const customNeedle: string = core.getInput('needle')
    const untilInput: string = core.getInput('until')
    const until = untilInput ? new RegExp(untilInput, 'gmi') : undefined

    if (readMode === 'file') {
      haystack = await fs.readFile(haystack, 'utf8')
    }

    const matches = await extractor(haystack, {
      needle: new RegExp(customNeedle, 'gmi'),
      until,
      mode
    })

    core.startGroup('Inputs')
    core.info(`Haystack: ${haystack}`)
    core.info(`Needle: ${customNeedle}`)
    core.info(`Until: ${until}`)
    core.info(`Mode: ${mode}`)
    core.info(`Read mode: ${readMode}`)
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
