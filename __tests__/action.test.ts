import {expect, test, beforeEach} from '@jest/globals'
import {readFileSync} from 'fs'
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
