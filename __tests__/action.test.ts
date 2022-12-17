import {expect, test, beforeEach} from '@jest/globals'
import {access, readFileSync} from 'fs'
import * as action from '../src/main'

const core = require('@actions/core')

// shows how the runner will run a javascript action with env / stdout protocol
test('sets output', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content
  }
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }

  // Act
  await action.run()

  // Assert
  expect(output['matches']).toHaveLength(3)
})

test('reads custom regex from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    needle: 'Lorem'
  }
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }

  // Act
  await action.run()

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('Lorem')
})

test('reads mode all from input', async () => {
  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8')
  let input: any = {
    haystack: content,
    mode: 'all'
  }
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }

  // Act
  await action.run()

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
    mode: 'unique'
  }
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }

  // Act
  await action.run()

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
    mode: 'first'
  }
  core.getInput = (name: any) => {
    return input[name]
  }
  let output: any = {}
  core.setOutput = (name: string, value: any) => {
    output[name] = value
  }

  // Act
  await action.run()

  // Assert
  expect(output['matches']).toHaveLength(1)
  expect(output['matches']).toContain('ABC-123')
})
