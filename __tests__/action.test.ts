import {expect, test} from '@jest/globals'
import {readFileSync} from 'fs'
import {JIRA_ISSUE} from '../src/extractor'
import * as action from '../src/main'

// Necessary to override getInput and setOutput behaviour
const core = require('@actions/core')

test('sets matches output', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    needle: JIRA_ISSUE,
    haystack: content
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(3)
})

test('sets has_matches output to `true` for matches', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    needle: JIRA_ISSUE,
    haystack: content
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['has_matches']).toBe(true)
})

test('sets has_matches output to `false` for no matches', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    needle: 'NOMATCH',
    haystack: content
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['has_matches']).toBe(false)
})

test('reads custom regex from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: 'Lorem'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('Lorem')
})

test('reads until regex from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: JIRA_ISSUE,
    until: 'voluptua'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

test('reads mode all from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'all'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(4)
  expect(output['matches']).toContain('ABC-123')
  expect(output['matches']).toContain('ABC-321')
  expect(output['matches']).toContain('ABC-42')
})

test('reads mode unique from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'unique'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(3)
  expect(output['matches']).toContain('ABC-123')
  expect(output['matches']).toContain('ABC-321')
  expect(output['matches']).toContain('ABC-42')
})

test('reads mode first from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: JIRA_ISSUE,
    mode: 'first'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

test('reads mode first from file at path', async () => {
  // Arrange
  let input: any = {
    haystack: 'resources/multi.txt',
    needle: JIRA_ISSUE,
    mode: 'first',
    read_mode: 'file'
  }

  // Act
  let output: any = await runAction(input)

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})

async function runAction(input: any) {
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }
  await action.run()
  return output
}
