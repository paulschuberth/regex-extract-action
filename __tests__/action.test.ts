import {expect, test} from '@jest/globals'
import {readFileSync} from 'fs'
import {JIRA_ISSUE} from '../src/extractor'
import * as action from '../src/main'

// Necessary to override getInput and setOutput behavior
/* eslint-disable @typescript-eslint/no-require-imports */
const core = require('@actions/core')

/* eslint-enable @typescript-eslint/no-require-imports */

interface ActionInput {
  needle: RegExp | string
  haystack: string
  until?: string
  mode?: string
  read_mode?: string
}

interface ActionOutput {
  has_matches: boolean
  matches: string[]
}

test('sets matches output', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    needle: JIRA_ISSUE,
    haystack: content
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(3)
})

test('sets has_matches output to `true` for matches', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    needle: JIRA_ISSUE,
    haystack: content
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['has_matches']).toBe(true)
})

test('sets has_matches output to `false` for no matches', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    needle: 'NOMATCH',
    haystack: content
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['has_matches']).toBe(false)
})

test('reads custom regex from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    haystack: content,
    needle: 'Lorem'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('Lorem')
})

test('reads until regex from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    haystack: content,
    needle: JIRA_ISSUE,
    until: 'voluptua'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

test('reads mode all from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'all'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(4)
  expect(output['matches']).toContain('ABC-123')
  expect(output['matches']).toContain('ABC-321')
  expect(output['matches']).toContain('ABC-42')
})

test('reads mode unique from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'unique'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(3)
  expect(output['matches']).toContain('ABC-123')
  expect(output['matches']).toContain('ABC-321')
  expect(output['matches']).toContain('ABC-42')
})

test('reads mode first from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const input: ActionInput = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'first'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

test('reads mode first from file at path', async () => {
  // Arrange
  const input: ActionInput = {
    haystack: 'resources/multi.txt',
    needle: JIRA_ISSUE,
    mode: 'first',
    read_mode: 'file'
  }

  // Act
  const output: ActionOutput = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

async function runAction(input: ActionInput) {
  core.getInput = (name: keyof ActionInput) => {
    return input[name]
  }
  const output: ActionOutput = {has_matches: false, matches: []}
  core.setOutput = (
    name: keyof ActionOutput,
    value: ActionOutput[keyof ActionOutput]
  ) => {
    // @ts-expect-error It's okay here since we are _just_ using out own test types here.
    output[name] = value
  }
  await action.run()
  return output
}
