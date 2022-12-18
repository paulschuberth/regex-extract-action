<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Regex Extract Action

This action can be used to find occurences of a regular expression with a text.

## Inputs

### haystack

The text in which to search for matches of the reqular expression. This input is required.

### needle

The regular expression that is used to find matched. The default value, `[A-Z]+-\d+`, works
fine for JIRA issues. This input is optional.

### mode

The mode in which to run this action. Possible values are `all`, `unique`, and `first`. They make the
action write all matches, unique matches, or only the first match to the `matches` output, respectively.
The default value is `unique`. This input is optional.

## Outputs

### matches

A JSON list of all matches. The list is empty if there are no matches.

## Example usage

The [example workflow](https://github.com/paulschuberth/regex-extract-action/blob/main/.github/workflows/example.yml) in this repo shows one example of how to use this action.
