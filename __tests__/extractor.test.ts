import {extractor} from '../src/extractor'
import {expect, test, beforeEach} from '@jest/globals'
import {readFileSync} from 'fs'

const core = require('@actions/core')

test('finds jira issues by default', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content)
  expect(actual).toEqual(['ABC-23'])
})

test('can be given different regexp', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content, /\d+/gm)
  expect(actual).not.toEqual(['ABC-23'])
})

test('deduplicates matches', async () => {
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const actual = await extractor(content)
  expect(actual).toContain('ABC-123')
  expect(actual).toContain('ABC-321')
  expect(actual).toContain('ABC-42')
  expect(actual).toHaveLength(3)
})
