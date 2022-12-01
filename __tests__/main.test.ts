import { extractor } from '../src/extractor'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { expect, test, beforeEach } from '@jest/globals'
import { readFileSync } from 'fs';
import * as action from '../src/main'
import { describe } from 'node:test'

const core = require('@actions/core')



test('finds jira issues by default', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8');
  const actual = await extractor(content)
  expect(actual).toEqual(['ABC-23'])
});

test('can be given different regexp', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8');
  const actual = await extractor(content, /\d+/gm)
  expect(actual).not.toEqual(['ABC-23'])
});

test('deduplicates matches', async () => {
  const content = readFileSync('resources/multi.txt', 'utf-8');
  const actual = await extractor(content)
  expect(actual).toContain('ABC-123')
  expect(actual).toContain('ABC-321')
  expect(actual).toContain('ABC-42')
  expect(actual).toHaveLength(3)
});

// shows how the runner will run a javascript action with env / stdout protocol
test('sets output', async () => {

  // Arrange
  const content = readFileSync('resources/multi.txt', 'utf-8');
  let input : any = {
    'haystack': content
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
    const content = readFileSync('resources/multi.txt', 'utf-8');
    let input : any = {
      'haystack': content,
      'needle': 'Lorem'
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