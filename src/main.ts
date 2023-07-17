import * as core from "@actions/core";
import { extractor, Mode } from "./extractor";
import * as _ from "lodash";

export async function run(): Promise<void> {
  try {
    const haystack: string = core.getInput("haystack");
    const mode = core.getInput("mode") as Mode;
    const customNeedle: string = _.escapeRegExp(core.getInput("needle"));
    const untilInput: string = _.escapeRegExp(core.getInput("until"));
    const until = untilInput ? new RegExp(untilInput, "gmi") : undefined;

    const matches = await extractor(haystack, {
      needle: new RegExp(customNeedle, "gmi"),
      until,
      mode
    });

    core.startGroup("Inputs");
    core.info(`Haystack: ${haystack}`);
    core.info(`Needle: ${customNeedle}`);
    core.info(`Until: ${until}`);
    core.info(`Mode: ${mode}`);
    core.endGroup();

    core.startGroup("Outputs");
    core.info(`Matches: ${matches}`);
    core.endGroup();

    const hasMatches = matches.length > 0;
    core.setOutput("has_matches", hasMatches);
    core.setOutput("matches", matches);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run().then(_ => core.info("Finished"));
