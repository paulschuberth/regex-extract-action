import {extractor, JIRA_ISSUE, Mode} from '../src/extractor'
import {expect, test, beforeEach} from '@jest/globals'
import {readFileSync} from 'fs'
import {it} from 'node:test'

const core = require('@actions/core')

test('finds jira issues by default', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content)
  expect(actual).toEqual(['ABC-23'])
})

test('can be given different regexp', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content, {needle: /\d+/gm})
  expect(actual).not.toEqual(['ABC-23'])
})

test('deduplicates matches by default', async () => {
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const actual = await extractor(content)
  expect(actual).toContain('ABC-123')
  expect(actual).toContain('ABC-321')
  expect(actual).toContain('ABC-42')
  expect(actual).toHaveLength(3)
})

test('returns empty list for no matches in first mode', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content, {needle: /NOMATCH/gm, mode: 'first'})
  expect(actual).toHaveLength(0)
  expect(actual).toBeInstanceOf(Array)
})

test('returns empty list for no matches in all mode', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content, {needle: /NOMATCH/gm, mode: 'all'})
  expect(actual).toHaveLength(0)
  expect(actual).toBeInstanceOf(Array)
})

test('returns empty list for no matches in unique mode', async () => {
  const content = readFileSync('resources/single.txt', 'utf-8')
  const actual = await extractor(content, {needle: /NOMATCH/gm, mode: 'unique'})
  expect(actual).toHaveLength(0)
  expect(actual).toBeInstanceOf(Array)
})

test('can return only the first match', async () => {
  const content = readFileSync('resources/multi.txt', 'utf-8')
  const actual = await extractor(content, {mode: 'first'})
  expect(actual).toContain('ABC-123')
  expect(actual).toHaveLength(1)
})
